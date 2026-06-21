import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogOverlay } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, FileText, Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const ContentAdmin = ({ userRole }) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    email_subject: '',
    content: '',
    status: 'draft',
    scheduled_date: '',
    recipient_count: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPromotions = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw new Error(error.message);
      setPromotions(data || []);
    } catch (err) {
      setErrorMsg("Failed to load promotions. " + (err.message || "Please check your permissions."));
      toast({ variant: 'destructive', title: 'Fetch Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleCreateClick = () => {
    setFormData({
      title: '',
      email_subject: '',
      content: '',
      status: 'draft',
      scheduled_date: '',
      recipient_count: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (promo) => {
    setFormData({
      id: promo.id,
      title: promo.title || '',
      email_subject: promo.email_subject || '',
      content: promo.content || '',
      status: promo.status || 'draft',
      scheduled_date: promo.scheduled_date ? new Date(promo.scheduled_date).toISOString().slice(0, 16) : '',
      recipient_count: promo.recipient_count || ''
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleCreatePromotion = async (payload) => {
    const { error } = await supabase.from('promotions').insert([payload]);
    if (error) throw new Error(error.message);
  };

  const handleEditPromotion = async (id, payload) => {
    const { error } = await supabase.from('promotions').update(payload).eq('id', id);
    if (error) throw new Error(error.message);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.email_subject || !formData.content || !formData.status) {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Title, Email Subject, Content, and Status are required.' });
      return;
    }

    setSaving(true);
    
    // Prepare payload with ONLY valid columns
    const payload = {
      title: formData.title,
      email_subject: formData.email_subject,
      content: formData.content,
      status: formData.status,
      scheduled_date: formData.scheduled_date ? new Date(formData.scheduled_date).toISOString() : null,
      recipient_count: formData.recipient_count !== '' ? parseInt(formData.recipient_count, 10) : null
    };

    try {
      if (isEditing && formData.id) {
        await handleEditPromotion(formData.id, payload);
        toast({ title: 'Success', description: 'Promotion updated successfully' });
      } else {
        await handleCreatePromotion(payload);
        toast({ title: 'Success', description: 'Promotion created successfully' });
      }
      setIsModalOpen(false);
      fetchPromotions();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error saving promotion', description: err.message });
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePromotion = async (id) => {
    const { error } = await supabase.from('promotions').delete().eq('id', id);
    if (error) throw new Error(error.message);
  };

  const handleDeleteClick = async (promo) => {
    if (window.confirm(`Are you sure you want to delete the promotion "${promo.title}"?`)) {
      try {
        await handleDeletePromotion(promo.id);
        toast({ title: 'Success', description: 'Promotion deleted successfully' });
        fetchPromotions();
      } catch (err) {
        toast({ variant: 'destructive', title: 'Error deleting promotion', description: err.message });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1a2e]">
      <AdminSidebar userRole={userRole} onLogout={async () => { await supabase.auth.signOut(); navigate('/admin/login'); }} />
      <div className="ml-64 p-8">
        {userRole === 'super_admin' && (
          <Button variant="ghost" className="text-slate-500 pl-0 mb-4 hover:bg-transparent hover:text-[#d4af37]" onClick={() => navigate('/admin/super')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Super Admin
          </Button>
        )}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Content Management</h1>
            <p className="mt-1 text-slate-500">Manage site copy, email campaigns, and marketing promotions</p>
          </div>
          <span className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/50 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase flex items-center shadow-sm">
            <FileText className="w-4 h-4 mr-2" />
            {userRole ? userRole.replace('_', ' ') : 'Admin'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Email Promotions ({promotions.length})</h2>
            <Button className="bg-[#d4af37] text-slate-900 hover:bg-[#c19a2f]" onClick={handleCreateClick}>
              <Plus className="w-4 h-4 mr-2" /> Create Promotion
            </Button>
          </div>

          {errorMsg ? (
            <div className="p-8 text-center text-red-500 bg-red-50 m-4 rounded-lg">{errorMsg}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Subject Line</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Scheduled For</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {loading ? (
                    <tr><td colSpan="5" className="px-6 py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#d4af37]" /></td></tr>
                  ) : promotions.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No promotions found.</td></tr>
                  ) : (
                    promotions.map(promo => (
                      <tr key={promo.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4 font-medium">{promo.title}</td>
                        <td className="px-6 py-4 text-slate-500">{promo.email_subject}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${promo.status === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                            {promo.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{promo.scheduled_date ? format(new Date(promo.scheduled_date), 'MMM d, yyyy HH:mm') : 'Not scheduled'}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(promo)} className="cursor-pointer">
                            <Edit className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(promo)} className="cursor-pointer">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Custom Form Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay style={{ zIndex: 40 }} />
          <DialogContent style={{ zIndex: 50, backgroundColor: '#ffffff', color: '#000' }} className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle style={{ color: '#000' }}>{isEditing ? 'Edit' : 'Create'} Promotion</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label style={{ color: '#000' }}>Title *</Label>
                <Input
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ color: '#000', backgroundColor: '#fff', borderColor: '#ccc' }}
                  placeholder="e.g., Summer Sale Campaign"
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: '#000' }}>Email Subject *</Label>
                <Input
                  required
                  value={formData.email_subject || ''}
                  onChange={(e) => setFormData({ ...formData, email_subject: e.target.value })}
                  style={{ color: '#000', backgroundColor: '#fff', borderColor: '#ccc' }}
                  placeholder="e.g., Don't miss our summer specials!"
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: '#000' }}>Content *</Label>
                <Textarea
                  required
                  rows={4}
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  style={{ color: '#000', backgroundColor: '#fff', borderColor: '#ccc' }}
                  placeholder="Email body or HTML content..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: '#000' }}>Scheduled Date</Label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduled_date || ''}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    style={{ color: '#000', backgroundColor: '#fff', borderColor: '#ccc' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label style={{ color: '#000' }}>Recipient Count</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.recipient_count || ''}
                    onChange={(e) => setFormData({ ...formData, recipient_count: e.target.value })}
                    style={{ color: '#000', backgroundColor: '#fff', borderColor: '#ccc' }}
                    placeholder="e.g., 500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label style={{ color: '#000' }}>Status *</Label>
                <Select value={formData.status || 'draft'} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger style={{ color: '#000', backgroundColor: '#fff', borderColor: '#ccc' }}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent style={{ zIndex: 60, backgroundColor: '#fff' }}>
                    <SelectItem value="draft" style={{ color: '#000' }}>Draft</SelectItem>
                    <SelectItem value="scheduled" style={{ color: '#000' }}>Scheduled</SelectItem>
                    <SelectItem value="sent" style={{ color: '#000' }}>Sent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-[#d4af37] text-black hover:bg-[#c19a2f]">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Promotion'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default ContentAdmin;