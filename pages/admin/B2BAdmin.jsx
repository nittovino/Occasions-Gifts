import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Briefcase, Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const B2BAdmin = ({ userRole }) => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_email: '',
    commission_rate: '',
    status: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('b2b_partners')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setPartners(data || []);
    } catch (err) {
      toast({ 
        variant: 'destructive', 
        title: 'Error loading partners', 
        description: err.message || "Failed to load partners" 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleAddPartner = () => {
    setFormData({
      company_name: '',
      contact_email: '',
      commission_rate: '',
      status: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const rate = parseFloat(formData.commission_rate);
    
    return (
      formData.company_name?.trim() !== '' &&
      emailRegex.test(formData.contact_email) &&
      !isNaN(rate) && rate >= 0 &&
      formData.status !== '' && formData.status !== 'Select status'
    );
  };

  const handleSavePartner = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setSaving(true);
    const payload = {
      company_name: formData.company_name.trim(),
      contact_email: formData.contact_email.trim(),
      commission_rate: parseFloat(formData.commission_rate),
      status: formData.status
    };
    
    console.log("B2B Partner payload:", payload);
    
    try {
      if (isEditing && formData.id) {
        const { error } = await supabase
          .from('b2b_partners')
          .update(payload)
          .eq('id', formData.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Partner updated successfully' });
      } else {
        const { error } = await supabase
          .from('b2b_partners')
          .insert([payload]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Partner created successfully' });
      }
      
      setIsModalOpen(false);
      setFormData({ company_name: '', contact_email: '', commission_rate: '', status: '' });
      fetchPartners();
    } catch (err) {
      toast({ 
        variant: 'destructive', 
        title: 'Error saving partner', 
        description: err.message 
      });
    } finally {
      setSaving(false);
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
            <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">B2B Management</h1>
            <p className="mt-1 text-slate-500">Manage corporate partners and bulk orders</p>
          </div>
          <span className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/50 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase flex items-center shadow-sm">
            <Briefcase className="w-4 h-4 mr-2" />
            {userRole ? userRole.replace('_', ' ') : 'Admin'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">B2B Partners ({partners.length})</h2>
            <Button className="bg-[#d4af37] text-slate-900 hover:bg-[#c19a2f]" onClick={handleAddPartner}>
              <Plus className="w-4 h-4 mr-2" /> Add Partner
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                <tr>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Contact Email</th>
                  <th className="px-6 py-4">Commission</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#d4af37]" /></td></tr>
                ) : partners.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">No B2B partners found.</td></tr>
                ) : (
                  partners.map(partner => (
                    <tr key={partner.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 pointer-events-auto">
                      <td className="px-6 py-4 font-medium">{partner.company_name}</td>
                      <td className="px-6 py-4 text-slate-500">{partner.contact_email}</td>
                      <td className="px-6 py-4">{partner.commission_rate}%</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${partner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                          {partner.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{partner.created_at ? format(new Date(partner.created_at), 'MMM d, yyyy') : '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => { 
                          setFormData({ ...partner }); 
                          setIsEditing(true); 
                          setIsModalOpen(true); 
                        }} className="pointer-events-auto cursor-pointer">
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom Add/Edit Partner Modal */}
        <Dialog open={isModalOpen} onOpenChange={(open) => !saving && setIsModalOpen(open)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-[#1a1a1a]">{isEditing ? 'Edit' : 'Add'} B2B Partner</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSavePartner} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-[#1a1a1a]">Company Name <span className="text-red-500">*</span></Label>
                <Input
                  id="company_name"
                  className="b2b-modal-input"
                  style={{ color: '#1a1a1a', backgroundColor: 'white', borderColor: '#ccc' }}
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Enter company name"
                  disabled={saving}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email" className="text-[#1a1a1a]">Contact Email <span className="text-red-500">*</span></Label>
                <Input
                  id="contact_email"
                  type="email"
                  className="b2b-modal-input"
                  style={{ color: '#1a1a1a', backgroundColor: 'white', borderColor: '#ccc' }}
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="Enter contact email"
                  disabled={saving}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commission_rate" className="text-[#1a1a1a]">Commission Rate (%) <span className="text-red-500">*</span></Label>
                <Input
                  id="commission_rate"
                  type="number"
                  min="0"
                  step="0.01"
                  className="b2b-modal-input"
                  style={{ color: '#1a1a1a', backgroundColor: 'white', borderColor: '#ccc' }}
                  value={formData.commission_rate}
                  onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
                  placeholder="0.00"
                  disabled={saving}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#1a1a1a]">Status <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                  disabled={saving}
                  required
                >
                  <SelectTrigger className="b2b-modal-select" style={{ color: '#1a1a1a', backgroundColor: 'white', borderColor: '#ccc' }}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-[#1a1a1a]">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="text-slate-700"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving || !isFormValid()}
                  className="bg-[#d4af37] text-slate-900 hover:bg-[#c19a2f]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Partner'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default B2BAdmin;