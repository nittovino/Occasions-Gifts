import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Package, DollarSign, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage, generateId } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';

const StorePortal = () => {
  const { currentUser } = useAuth();
  const { getItem, setItem } = useLocalStorage();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [store, setStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price_eur: '',
    category: 'Flowers',
    stock: '',
    image_url: ''
  });

  useEffect(() => {
    const stores = getItem('stores') || [];
    const userStore = stores.find(s => s.owner_id === currentUser?.id);
    setStore(userStore);

    if (userStore) {
      const allOrders = getItem('orders') || [];
      const storeOrders = allOrders.filter(o => o.store_id === userStore.id);
      setOrders(storeOrders);

      const allProducts = getItem('products') || [];
      const storeProducts = allProducts.filter(p => p.store_id === userStore.id);
      setProducts(storeProducts);
    }
  }, [currentUser]);

  const handleProductSubmit = (e) => {
    e.preventDefault();
    
    const allProducts = getItem('products') || [];
    
    if (editingProduct) {
      const updatedProducts = allProducts.map(p =>
        p.id === editingProduct.id ? { ...p, ...productForm } : p
      );
      setItem('products', updatedProducts);
      setProducts(updatedProducts.filter(p => p.store_id === store.id));
      toast({
        title: t('productUpdated'),
        description: t('productUpdated'),
      });
    } else {
      const newProduct = {
        id: generateId(),
        store_id: store.id,
        ...productForm,
        price_eur: parseFloat(productForm.price_eur),
        stock: parseInt(productForm.stock),
        status: 'active',
        created_at: new Date().toISOString()
      };
      allProducts.push(newProduct);
      setItem('products', allProducts);
      setProducts([...products, newProduct]);
      toast({
        title: t('productAdded'),
        description: t('productAdded'),
      });
    }

    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price_eur: '',
      category: 'Flowers',
      stock: '',
      image_url: ''
    });
  };

  const handleDeleteProduct = (productId) => {
    const allProducts = getItem('products') || [];
    const updatedProducts = allProducts.filter(p => p.id !== productId);
    setItem('products', updatedProducts);
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: t('productDeleted'),
      description: t('productDeleted'),
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price_eur: product.price_eur.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image_url: product.image_url
    });
    setShowProductForm(true);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const allOrders = getItem('orders') || [];
    const updatedOrders = allOrders.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setItem('orders', updatedOrders);
    setOrders(updatedOrders.filter(o => o.store_id === store.id));
    toast({
      title: t('orderUpdated'),
      description: `${t('orderUpdated')}: ${t(newStatus)}`,
    });
  };

  const analytics = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total_eur, 0),
    storeShare: orders.reduce((sum, o) => sum + (o.total_eur * 0.8), 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length
  };

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
            <p className="text-white text-xl mb-4">{t('noStore')}</p>
            <p className="text-slate-400">{t('contactAdmin')}</p>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>{t('storePortal')} - {store.name}</title>
        <meta name="description" content="Manage your store" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold text-white mb-2">{store.name}</h1>
            <p className="text-slate-400">{store.city}, {store.country}</p>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{t('totalOrders')}</p>
                    <p className="text-3xl font-bold text-white">{analytics.totalOrders}</p>
                  </div>
                  <Package className="h-10 w-10 text-[#d4af37]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{t('totalRevenue')}</p>
                    <p className="text-3xl font-bold text-white">€{analytics.totalRevenue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-10 w-10 text-[#d4af37]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{t('yourShare')}</p>
                    <p className="text-3xl font-bold text-[#d4af37]">€{analytics.storeShare.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-[#d4af37]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{t('pendingOrders')}</p>
                    <p className="text-3xl font-bold text-white">{analytics.pendingOrders}</p>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">{analytics.pendingOrders}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders Section */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">{t('orders')}</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-slate-400 text-center py-8">{t('noOrders')}</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-400">{t('orderId')}</TableHead>
                      <TableHead className="text-slate-400">{t('customer')}</TableHead>
                      <TableHead className="text-slate-400">{t('amount')}</TableHead>
                      <TableHead className="text-slate-400">{t('status')}</TableHead>
                      <TableHead className="text-slate-400">{t('date')}</TableHead>
                      <TableHead className="text-slate-400">{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id.slice(0, 8)}</TableCell>
                        <TableCell>{order.customer_name}</TableCell>
                        <TableCell>€{order.total_eur.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'pending' ? 'secondary' : 'success'}>
                            {t(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              className="bg-[#d4af37] hover:bg-[#c19a2f] text-[#1a2a4a]"
                            >
                              {t('confirm')}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Products Section */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">{t('products')}</CardTitle>
              <Button
                onClick={() => {
                  setShowProductForm(!showProductForm);
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    description: '',
                    price_eur: '',
                    category: 'Flowers',
                    stock: '',
                    image_url: ''
                  });
                }}
                className="bg-[#d4af37] hover:bg-[#c19a2f] text-[#1a2a4a]"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('addProduct')}
              </Button>
            </CardHeader>
            <CardContent>
              {showProductForm && (
                <form onSubmit={handleProductSubmit} className="bg-slate-700/30 p-6 rounded-lg mb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">{t('productName')}</label>
                      <Input
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">{t('selectCategory')}</label>
                      <Select
                        value={productForm.category}
                        onValueChange={(value) => setProductForm({...productForm, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Flowers">{t('Flowers')}</SelectItem>
                          <SelectItem value="Gift Baskets">{t('GiftBaskets')}</SelectItem>
                          <SelectItem value="Jewelry">{t('Jewelry')}</SelectItem>
                          <SelectItem value="Food & Beverage">{t('FoodBeverage')}</SelectItem>
                          <SelectItem value="Special Occasions">{t('SpecialOccasions')}</SelectItem>
                          <SelectItem value="Wellness">{t('Wellness')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">{t('description')}</label>
                    <Textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">{t('price')} (EUR)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={productForm.price_eur}
                        onChange={(e) => setProductForm({...productForm, price_eur: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">{t('stock')}</label>
                      <Input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">{t('imageUrl')}</label>
                      <Input
                        type="url"
                        value={productForm.image_url}
                        onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="bg-[#d4af37] hover:bg-[#c19a2f] text-[#1a2a4a]">
                      {editingProduct ? t('updateProduct') : t('addProduct')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                      }}
                      className="text-white border-slate-600"
                    >
                      {t('cancel')}
                    </Button>
                  </div>
                </form>
              )}

              {products.length === 0 ? (
                <p className="text-slate-400 text-center py-8">{t('noProductsFound')}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(product => (
                    <Card key={product.id} className="bg-slate-700/30 border-slate-600">
                      <CardContent className="p-4">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h3 className="text-white font-semibold mb-1">{product.name}</h3>
                        <p className="text-sm text-slate-400 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[#d4af37] font-semibold">€{product.price_eur}</span>
                          <span className="text-sm text-slate-400">{t('stock')}: {product.stock}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 text-white border-slate-600"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            {t('edit')}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-400 border-red-400 hover:bg-red-400/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StorePortal;