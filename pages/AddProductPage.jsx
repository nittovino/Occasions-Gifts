import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, HelpCircle, Save, CheckCircle, Loader2 } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useProductDraft } from '@/hooks/useProductDraft';
import { useToast } from '@/components/ui/use-toast';
import { ProductService } from '@/services/ProductService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ProductImageUpload from '@/components/ProductImageUpload';
import ProductImagePreview from '@/components/ProductImagePreview';
import PrepTimeField from '@/components/PrepTimeField';

const categories = ['Flowers', 'Cakes', 'Gifts', 'Gift Cards', 'Other'];

const AddProductPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useSupabaseAuth();
  const { toast } = useToast();
  const { errors, validateField, validateForm } = useFormValidation();
  const { saveDraft, loadDraft, clearDraft, isDraftAvailable } = useProductDraft(currentUser?.id);

  const [isLoading, setIsLoading] = useState(false);
  const hiddenFileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    leadTimeDays: 1,
    stockStatus: 'available'
  });

  const [imageState, setImageState] = useState({
    uploadedImage: null,
    zoom: 1,
    position: { x: 0, y: 0 }
  });

  // Load draft on mount
  useEffect(() => {
    if (isDraftAvailable()) {
      const draft = loadDraft();
      if (draft) {
        setFormData({
          name: draft.name || '',
          category: draft.category || '',
          price: draft.price || '',
          description: draft.description || '',
          leadTimeDays: draft.leadTimeDays ?? 1,
          stockStatus: draft.stockStatus || 'available'
        });
        toast({
          title: "Draft Restored",
          description: "We found an unsaved product draft and restored it for you.",
          className: "bg-[#0F1B2E] border-slate-700 text-white"
        });
      }
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (currentUser?.id) {
      saveDraft(formData);
    }
  }, [formData, currentUser?.id, saveDraft]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleImageUpload = (base64Str) => {
    setImageState({
      uploadedImage: base64Str,
      zoom: 1,
      position: { x: 0, y: 0 }
    });
    validateField('image', base64Str);
  };

  const handleReplaceClick = () => {
    if (hiddenFileInputRef.current) {
      hiddenFileInputRef.current.click();
    }
  };

  const handleHiddenFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid file", description: "Must be an image.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        handleImageUpload(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    // Validate custom
    let valid = true;
    if (!formData.name) valid = false;
    if (!formData.price) valid = false;
    if (!formData.description) valid = false;
    if (!imageState.uploadedImage) {
      valid = false;
      toast({ variant: "destructive", title: "Missing Image", description: "Please upload a product image." });
    }

    if (!valid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill all required fields and upload an image."
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await ProductService.publishProduct(
        { 
          ...formData, 
          imagePreview: imageState.uploadedImage,
          imageData: { zoom: imageState.zoom, position: imageState.position }
        },
        null,
        currentUser.id
      );

      if (response.success) {
        clearDraft();
        toast({
          title: "Product Published!",
          description: `${formData.name} is now live in your store.`,
          className: "bg-green-900 border-green-700 text-white"
        });
        navigate('/store/products');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Publish Failed",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a2a4a] text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
           <div className="flex items-center text-sm text-slate-400 mb-4 space-x-2">
              <span className="hover:text-white cursor-pointer" onClick={() => navigate('/store')}>Store Dashboard</span>
              <span>/</span>
              <span className="hover:text-white cursor-pointer" onClick={() => navigate('/store/products')}>Products</span>
              <span>/</span>
              <span className="text-[#D4AF37]">Add New Product</span>
           </div>

           <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full border border-slate-700 hover:bg-slate-800 text-white">
                    <ChevronLeft className="w-5 h-5" />
                 </Button>
                 <h1 className="text-3xl font-bold font-serif">Add New Product</h1>
                 <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-5 h-5 text-slate-500 hover:text-[#D4AF37] transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700">
                        <p>Fill out all details to add a product to your store catalog.</p>
                      </TooltipContent>
                    </Tooltip>
                 </TooltipProvider>
              </div>

              <div className="flex gap-3">
                 <Button variant="outline" className="hidden sm:flex border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800">
                    <Save className="w-4 h-4 mr-2" /> Save Draft
                 </Button>
                 <Button 
                   onClick={handlePublish} 
                   disabled={isLoading}
                   className="bg-gradient-to-r from-[#D4AF37] to-[#F2C94C] text-black font-bold hover:shadow-lg hover:shadow-[#D4AF37]/20 border-0 min-w-[140px]"
                 >
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    {isLoading ? "Publishing..." : "Publish Product"}
                 </Button>
              </div>
           </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Left Column: Form Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-[14px] font-medium text-[#1a2a4a] mb-1">
                  Product Name <span className="text-[#EF4444]">*</span>
                </label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="e.g. Red Rose Bouquet"
                  className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] px-[12px] py-[12px] text-[14px] text-[#1a2a4a] focus:outline-none focus:border-[#D4AF37] hover:bg-[#F3F4F6] transition-colors duration-300"
                />
              </div>

              {/* Improved Category Dropdown */}
              <div className="col-span-1 md:col-span-1 lg:col-span-2">
                <label className="block text-[14px] font-medium text-[#1a2a4a] mb-1">
                  Category <span className="text-[#EF4444]">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] px-[12px] py-[12px] text-[14px] text-[#1a2a4a] focus:outline-none focus:border-[#D4AF37] hover:bg-[#F3F4F6] transition-colors duration-300 appearance-none min-w-[100%]"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#1a2a4a] mb-1">
                  Price (€) <span className="text-[#EF4444]">*</span>
                </label>
                <input 
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleFieldChange('price', e.target.value)}
                  placeholder="25.00"
                  className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] px-[12px] py-[12px] text-[14px] text-[#1a2a4a] focus:outline-none focus:border-[#D4AF37] hover:bg-[#F3F4F6] transition-colors duration-300"
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#1a2a4a] mb-1">
                  Description <span className="text-[#EF4444]">*</span>
                </label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Describe your product..."
                  className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] px-[12px] py-[12px] text-[14px] text-[#1a2a4a] focus:outline-none focus:border-[#D4AF37] hover:bg-[#F3F4F6] transition-colors duration-300 min-h-[120px] resize-y"
                />
              </div>

              {/* Overriding the PrepTimeField styles to match this container's light theme if necessary, 
                  but we'll just pass the state for now */}
              <div className="bg-[#F9FAFB] p-4 rounded-[8px] border border-[#E5E7EB]">
                 <PrepTimeField 
                  leadTimeDays={formData.leadTimeDays} 
                  onChange={(val) => handleFieldChange('leadTimeDays', val)} 
                 />
              </div>
            </div>

            {/* Right Column: Image Upload/Preview */}
            <div>
              <label className="block text-[14px] font-medium text-[#1a2a4a] mb-1">
                Product Image <span className="text-[#EF4444]">*</span>
              </label>
              <p className="text-[#6B7280] text-[13px] mb-3 italic">Recommended size: 800x800px</p>
              
              {!imageState.uploadedImage ? (
                <ProductImageUpload onImageChange={handleImageUpload} />
              ) : (
                <ProductImagePreview 
                  imageSrc={imageState.uploadedImage}
                  zoom={imageState.zoom}
                  position={imageState.position}
                  onZoomChange={(val) => setImageState(prev => ({...prev, zoom: val}))}
                  onPositionChange={(pos) => setImageState(prev => ({...prev, position: pos}))}
                  onRemove={() => setImageState({ uploadedImage: null, zoom: 1, position: {x:0, y:0} })}
                  onReplace={handleReplaceClick}
                  onReset={() => setImageState(prev => ({...prev, zoom: 1, position: {x:0, y:0}}))}
                />
              )}
              
              <input 
                type="file" 
                ref={hiddenFileInputRef} 
                onChange={handleHiddenFileChange} 
                className="hidden" 
                accept="image/png, image/jpeg, image/gif" 
              />
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddProductPage;