import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogOverlay } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Share2, Loader2, Plus, Edit, Trash2, Search, Check } from 'lucide-react';
import { format } from 'date-fns';
import { AdminCRUDService } from '@/services/AdminCRUDService';
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog';

const AffiliateAdmin = ({ userRole }) => {
  const [affiliates, setAffiliates] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // User Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    user_id: '',
    member_name: '',
    member_email: '',
    referral_code: '',
    commission_rate: '',
    status: 'active'
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const loadAffiliates = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // 1. Fetch affiliate_partners
      const { data: affiliatesData, error: affiliatesError } = await supabase
        .from('affiliate_partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (affiliatesError) {
        console.error('Error fetching affiliates:', affiliatesError);
        setAffiliates([]);
        setLoading(false);
        return;
      }

      if (!affiliatesData || affiliatesData.length === 0) {
        setAffiliates([]);
        setLoading(false);
        return;
      }

      // 2. Fetch profiles separately
      let profilesData = [];
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, full_name');
          
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else if (profiles) {
          profilesData = profiles;
        }
      } catch (err) {
        console.error("Exception fetching profiles:", err);
      }

      // 3. Manually match affiliate.user_id with profile.id
      const affiliatesWithUserData = affiliatesData.map(affiliate => {
        const profile = profilesData.find(p => p.id === affiliate.user_id);
        
        // 4. Add partner_name and partner_email properties
        return {
          ...affiliate,
          partner_name: profile?.full_name || 'Unknown',
          partner_email: profile?.email || 'Unknown'
        };
      });

      setAffiliates(affiliatesWithUserData);
    } catch (err) {
      console.error("Exception in loadAffiliates:", err);
      setErrorMsg("Failed to load affiliate partners. " + (err.message || "Please check your permissions."));
      setAffiliates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    loadAffiliates();
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddClick = () => {
    setFormData({ 
      user_id: '', 
      member_name: '',
      member_email: '',
      referral_code: '', 
      commission_rate: '', 
      status: 'active' 
    });
    setSearchQuery('');
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (affiliate) => {
    const displayName = affiliate.partner_name !== 'Unknown' ? affiliate.partner_name : affiliate.partner_email;
    const displayEmail = affiliate.partner_email;

    setFormData({
      id: affiliate.id,
      user_id: affiliate.user_id || '',
      member_name: displayName,
      member_email: displayEmail,
      referral_code: affiliate.referral_code || '',
      commission_rate: affiliate.commission_rate || '',
      status: affiliate.status || 'active'
    });
    setSearchQuery(`${displayName} (${displayEmail})`);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'OCCASIONS-';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleUserSelect = (user) => {
    setFormData(prev => ({
      ...prev,
      user_id: user.id,
      member_name: user.full_name || user.email,
      member_email: user.email
    }));
    setSearchQuery(`${user.full_name || 'Unknown'} (${user.email})`);
    setIsDropdownOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.user_id) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a user.' });
      return;
    }

    setSaving(true);
    
    const finalReferralCode = formData.referral_code?.trim() || generateReferralCode();
    
    const payload = {
      user_id: formData.user_id,
      referral_code: finalReferralCode,
      commission_rate: parseFloat(formData.commission_rate),
      status: formData.status || 'active'
    };

    try {
      if (isEditing && formData.id) {
        const { success, error } = await AdminCRUDService.updateAffiliate(formData.id, payload);
        if (!success) throw new Error(error);
        toast({ title: 'Success', description: 'Affiliate updated successfully' });
      } else {
        const { success, error } = await AdminCRUDService.addAffiliate(payload);
        if (!success) throw new Error(error);
        toast({ title: 'Success', description: 'Affiliate created successfully' });
      }
      setIsModalOpen(false);
      loadAffiliates();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAffiliate) return;
    const { success, error } = await AdminCRUDService.deleteAffiliate(selectedAffiliate.id);
    if (success) {
      toast({ title: 'Success', description: 'Deleted successfully' });
      loadAffiliates();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: error });
    }
  };

  const filteredUsers = users.filter(user => 
    (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Affiliate Management</h1>
            <p className="mt-1 text-slate-500">Manage affiliate programs and commission payouts</p>
          </div>
          <span className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/50 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase flex items-center shadow-sm">
            <Share2 className="w-4 h-4 mr-2" />
            {userRole ? userRole.replace('_', ' ') : 'Admin'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Affiliate Partners ({affiliates.length})</h2>
            <Button className="bg-[#d4af37] text-slate-900 hover:bg-[#c19a2f]" onClick={handleAddClick}>
              <Plus className="w-4 h-4 mr-2" /> Add Affiliate
            </Button>
          </div>

          {errorMsg ? (
            <div className="p-8 text-center text-red-500 bg-red-50 m-4 rounded-lg">{errorMsg}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  <tr>
                    <th className="px-6 py-4">Partner</th>
                    <th className="px-6 py-4">Member Email</th>
                    <th className="px-6 py-4">Code</th>
                    <th className="px-6 py-4">Commission</th>
                    <th className="px-6 py-4">Referrals</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {loading ? (
                    <tr><td colSpan="8" className="px-6 py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#d4af37]" /></td></tr>
                  ) : affiliates.length === 0 ? (
                    <tr><td colSpan="8" className="px-6 py-12 text-center text-slate-500">No affiliates found.</td></tr>
                  ) : (
                    affiliates.map(aff => {
                      const displayName = aff.partner_name;
                      const displayEmail = aff.partner_email;
                      
                      return (
                        <tr key={aff.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 pointer-events-auto">
                          <td className="px-6 py-4 font-medium">{displayName}</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{displayEmail}</td>
                          <td className="px-6 py-4 font-mono font-medium">{aff.referral_code}</td>
                          <td className="px-6 py-4">{aff.commission_rate}%</td>
                          <td className="px-6 py-4">{aff.total_referrals ?? '-'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              aff.status === 'active' ? 'bg-green-100 text-green-800' : 
                              aff.status === 'suspended' ? 'bg-red-100 text-red-800' : 
                              'bg-slate-100 text-slate-800'
                            }`}>
                              {aff.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500">{aff.created_at ? format(new Date(aff.created_at), 'MMM d, yyyy') : '-'}</td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(aff)} className="pointer-events-auto cursor-pointer"><Edit className="w-4 h-4 text-blue-500" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedAffiliate(aff); setDeleteDialogOpen(true); }} className="pointer-events-auto cursor-pointer"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Custom Form Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay style={{ zIndex: 40 }} />
          <DialogContent style={{ zIndex: 50, backgroundColor: '#ffffff', color: '#000' }} className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle style={{ color: '#000' }}>{isEditing ? 'Edit' : 'Add'} Affiliate</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 py-4">
              
              <div className="space-y-2 relative" ref={dropdownRef}>
                <Label style={{ color: '#000' }}>User Selection *</Label>
                <div className="relative">
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                      if (formData.user_id && e.target.value !== `${formData.member_name} (${formData.member_email})`) {
                        setFormData(prev => ({...prev, user_id: '', member_name: '', member_email: ''}));
                      }
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    style={{ color: '#000', backgroundColor: '#fff', borderColor: '#ccc', paddingRight: '2rem' }}
                  />
                  <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                </div>
                
                {isDropdownOpen && (
                  <div className="absolute z-[60] w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <div 
                          key={user.id} 
                          onClick={() => handleUserSelect(user)}
                          className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium text-sm text-slate-900">{user.full_name || 'Unknown'}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                          {formData.user_id === user.id && <Check className="w-4 h-4 text-green-500" />}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-500 text-center">No users found.</div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label style={{ color: '#000' }}>Member Name</Label>
                <Input
                  readOnly
                  value={formData.member_name || ''}
                  placeholder="Auto-populated"
                  className="bg-slate-50"
                  style={{ color: '#000', borderColor: '#ccc' }}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ color: '#000' }}>Member Email</Label>
                <Input
                  readOnly
                  value={formData.member_email || ''}
                  placeholder="Auto-populated"
                  className="bg-slate-50"
                  style={{ color: '#000', borderColor: '#ccc' }}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ color: '#000' }}>Referral Code</Label>
                <Input
                  value={formData.referral_code || ''}
                  onChange={(e) => setFormData({ ...formData, referral_code: e.target.value })}
                  placeholder="Leave blank to auto-generate"
                  style={{ color: '#000', backgroundColor: '#fff', borderColor: '#ccc' }}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ color: '#000' }}>Commission Rate (%) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={formData.commission_rate || ''}
                  onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
                  style={{ color: '#000', backgroundColor: '#fff', borderColor: '#ccc' }}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ color: '#000' }}>Status *</Label>
                <Select value={formData.status || 'active'} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger style={{ color: '#000', backgroundColor: '#fff', borderColor: '#ccc' }}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent style={{ zIndex: 60, backgroundColor: '#fff' }}>
                    <SelectItem value="active" style={{ color: '#000' }}>Active</SelectItem>
                    <SelectItem value="inactive" style={{ color: '#000' }}>Inactive</SelectItem>
                    <SelectItem value="suspended" style={{ color: '#000' }}>Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving || !formData.user_id} className="bg-[#d4af37] text-black hover:bg-[#c19a2f]">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <ConfirmDeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} itemType="affiliate" onConfirm={handleDelete} />
      </div>
    </div>
  );
};

export default AffiliateAdmin;