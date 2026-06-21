import { supabase } from '@/lib/supabase';

export const ProductService = {
  async publishProduct(productData, imageFile, merchantId) {
    if (!merchantId) {
      return { success: false, error: "Merchant ID is missing" };
    }
    if (!productData.name || !productData.price || !productData.category) {
      return { success: false, error: "Missing required product fields" };
    }

    try {
      let imageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `merchants/${merchantId}/${fileName}`;
        imageUrl = `https://mock-storage.com/${filePath}`;
      }

      const newProduct = {
        merchant_id: merchantId,
        name: productData.name,
        category: productData.category,
        price: parseFloat(productData.price),
        description: productData.description,
        delivery_type: productData.deliveryType,
        image_url: imageUrl || productData.imagePreview,
        image_data: productData.imageData,
        stock_status: productData.stockStatus || 'available',
        tags: productData.tags || [],
        lead_time_days: productData.leadTimeDays !== undefined ? parseInt(productData.leadTimeDays, 10) : 1,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log("Product Published (Stub):", newProduct);
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true, data: newProduct };

    } catch (error) {
      console.error("Product Publish Error:", error);
      return { success: false, error: error.message || "Failed to publish product" };
    }
  }
};