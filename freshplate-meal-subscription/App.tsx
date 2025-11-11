import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Modal } from './components/Modal';
import { ProductForm } from './components/ProductForm';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { INITIAL_PRODUCTS, INITIAL_USERS, ADMIN_USER } from './constants';
import type { Product, CartItem, Order, Subscription, OrderStatus, User } from './types';

const App: React.FC = () => {
  // Product State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState('home'); // home, cart, checkout, confirmation, admin, login, signup, track, dashboard, productDetail, about, pricing, gifting, blog, careers, privacy, terms
  const [pageBeforeLogin, setPageBeforeLogin] = useState<string | null>(null);
  const [orderToTrackRef, setOrderToTrackRef] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isDeleteAccountConfirmOpen, setIsDeleteAccountConfirmOpen] = useState(false);


  // Auth State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // App Data State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const isAdmin = currentUser?.role === 'admin';
  const hasActiveSubscription = !!currentUser && !!activeSubscription;
  
  // Effect to check for expired subscription on navigation
  useEffect(() => {
    if (activeSubscription && new Date() > new Date(activeSubscription.endDate)) {
      alert("Your monthly subscription has expired. You can now place a new order.");
      setSubscriptions(subs => subs.filter(s => s.id !== activeSubscription.id));
      setActiveSubscription(null);
    }
  }, [currentPage, activeSubscription]);


  // Navigate function
  const navigate = (page: string) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  }

  // Authentication Handlers
  const handleLogin = (email: string, password: string): boolean => {
    const isAdminLogin = email === ADMIN_USER.email && password === ADMIN_USER.password;
    if (isAdminLogin) {
      setCurrentUser(ADMIN_USER);
      navigate('admin');
      alert('Logged in as Admin successfully!');
      return true;
    }

    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setCurrentUser(foundUser);
      
      // Find and set active subscription for the logged-in user
      const userOrders = orders.filter(o => o.userId === foundUser.id);
      const userOrderIds = userOrders.map(o => o.id);
      const userSubscriptions = subscriptions.filter(s => userOrderIds.includes(s.orderId));
      
      const stillActiveSubscriptions = userSubscriptions.filter(s => new Date() < new Date(s.endDate));

      if (stillActiveSubscriptions.length > 0) {
        // Get the most recent one
        const latestActiveSub = stillActiveSubscriptions.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
        setActiveSubscription(latestActiveSub);
      } else {
        setActiveSubscription(null);
      }
      
      navigate(pageBeforeLogin || 'home');
      setPageBeforeLogin(null);
      return true;
    }
    
    alert('Invalid credentials. Please try again.');
    return false;
  };

  const handleSignUp = (name: string, email: string, password: string): boolean => {
    if (users.some(u => u.email === email) || email === ADMIN_USER.email) {
      alert('An account with this email already exists.');
      return false;
    }
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      password,
      role: 'user',
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    navigate('home');
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveSubscription(null);
    navigate('home');
  };

  const requestDeleteAccount = () => {
    setIsDeleteAccountConfirmOpen(true);
  };

  const handleConfirmDeleteAccount = () => {
    if (currentUser) {
        if (activeSubscription) {
            setSubscriptions(prevSubs => prevSubs.filter(sub => sub.id !== activeSubscription.id));
            setActiveSubscription(null);
        }
        setUsers(users.filter(u => u.id !== currentUser.id));
        alert('Your account has been deleted successfully. We are sorry to see you go.');
        
        // Reset state and navigate
        setIsDeleteAccountConfirmOpen(false);
        setCurrentUser(null);
        navigate('home');
    }
  };

  const handleCloseDeleteAccountModal = () => {
      setIsDeleteAccountConfirmOpen(false);
  };


  // Product Modal Handlers
  const handleOpenModal = (product: Product | null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct && product.id) {
      setProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      setProducts([...products, { ...product, id: Date.now() }]);
    }
    handleCloseModal();
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    navigate('productDetail');
  };

  // Cart Handlers
  const addToCart = (product: Product, quantity: number) => {
    if (activeSubscription) {
      alert("You already have an active subscription. Please cancel it before starting a new order.");
      return;
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };
  
  const updateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => item.id === productId ? {...item, quantity: newQuantity} : item));
    }
  };

  // Subscription & Order Handlers
  const requestSubscriptionCancel = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmCancelSubscription = () => {
    if (activeSubscription) {
      updateOrderStatus(activeSubscription.orderId, 'Refund Requested');
      setSubscriptions(prevSubs => prevSubs.filter(sub => sub.id !== activeSubscription.id));
      setActiveSubscription(null);
    }
    setShowCancelConfirm(false);
    alert('Your subscription has been cancelled. A refund request has been sent.');
  };

  const handleCloseCancelModal = () => {
    setShowCancelConfirm(false);
  };
  
  const handlePlaceOrder = () => {
    if (!currentUser) {
      alert("You must be logged in to place an order.");
      setPageBeforeLogin('checkout');
      navigate('login');
      return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: Date.now(),
      userId: currentUser.id,
      referenceNumber: `BB-${Date.now().toString().slice(-6)}`,
      items: [...cart],
      totalAmount,
      orderDate: new Date(),
      status: 'Processing'
    };
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);

    const newSubscription: Subscription = {
      id: Date.now(),
      orderId: newOrder.id,
      startDate: startDate,
      endDate: endDate,
      items: [...cart],
    };

    setOrders([...orders, newOrder]);
    setSubscriptions([...subscriptions, newSubscription]);
    setActiveSubscription(newSubscription);
    setCart([]);
    setConfirmedOrder(newOrder);
    navigate('confirmation');
  };

  const updateOrderStatus = (orderId: number, status: OrderStatus) => {
    setOrders(orders.map(order => order.id === orderId ? {...order, status} : order));
  };

  const handleDeleteOrder = (orderId: number) => {
    if (window.confirm('Are you sure you want to permanently delete this order? This action is irreversible.')) {
        if (activeSubscription?.orderId === orderId) {
            setActiveSubscription(null);
        }
        setSubscriptions(prevSubs => prevSubs.filter(sub => sub.orderId !== orderId));
        setOrders(orders.filter(o => o.id !== orderId));
        alert('Order deleted successfully.');
    }
  };

  const handleTrackOrderFromDashboard = (referenceNumber: string) => {
    setOrderToTrackRef(referenceNumber);
    navigate('track');
  };

  const clearOrderToTrack = () => {
    setOrderToTrackRef(null);
  };


  const renderPage = () => {
    if (isAdmin) {
      return <AdminDashboard 
        products={products}
        orders={orders}
        onEditProduct={handleOpenModal}
        onCreateProduct={() => handleOpenModal(null)}
        onUpdateStatus={updateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
      />;
    }

    if ((currentPage === 'checkout' || currentPage === 'dashboard' || currentPage === 'track') && !currentUser) {
        setPageBeforeLogin(currentPage);
        return <LoginPage onLogin={handleLogin} setCurrentPage={navigate} />;
    }

    switch(currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} setCurrentPage={navigate} />;
      case 'signup':
        return <SignUpPage onSignUp={handleSignUp} setCurrentPage={navigate} />;
      case 'cart':
        return <CartPage 
          cart={cart}
          removeFromCart={removeFromCart}
          updateCartQuantity={updateCartQuantity}
          setCurrentPage={navigate}
          isAuthenticated={!!currentUser}
          setPageBeforeLogin={setPageBeforeLogin}
        />;
      case 'checkout':
        return <CheckoutPage cart={cart} onPlaceOrder={handlePlaceOrder} />;
      case 'confirmation':
        return <OrderConfirmationPage order={confirmedOrder} subscription={activeSubscription} />;
      case 'track':
        return <TrackOrderPage 
            allOrders={orders} 
            initialTrackingNumber={orderToTrackRef}
            clearInitialTrackingNumber={clearOrderToTrack}
        />;
      case 'dashboard':
        return <UserDashboardPage
            activeSubscription={activeSubscription}
            userOrders={orders.filter(o => o.userId === currentUser?.id)}
            onCancelSubscription={requestSubscriptionCancel}
            onDeleteAccount={requestDeleteAccount}
            setCurrentPage={navigate}
            onTrackOrder={handleTrackOrderFromDashboard}
        />;
      case 'productDetail':
        return <ProductDetailPage 
          product={selectedProduct}
          onAddToCart={addToCart}
          hasActiveSubscription={hasActiveSubscription}
          onBack={() => navigate('home')}
        />;
      case 'about':
        return <PlaceholderPage title="About BoxBuddy" message="We are passionate about making healthy eating easy and delicious for everyone. Our chefs work tirelessly to create exciting new recipes with the freshest ingredients, delivered right to your door." onNavigate={navigate} />;
      case 'pricing':
          return <PlaceholderPage title="Our Pricing" message="Simple and transparent. One weekly price for a box of your chosen meals. No hidden fees, cancel anytime. Check out our meal selection to see individual meal prices that contribute to your weekly total." onNavigate={navigate}/>;
      case 'gifting':
          return <PlaceholderPage title="Gift a Box" message="Give the gift of health and convenience. Our gift cards can be redeemed for any of our meal plans. Perfect for new parents, busy professionals, or anyone who deserves a break from cooking!" onNavigate={navigate}/>;
      case 'blog':
        return <PlaceholderPage title="BoxBuddy Blog" message="Coming Soon! Get ready for delicious recipes, nutritional tips, and behind-the-scenes stories from our kitchen." onNavigate={navigate} />;
      case 'careers':
        return <PlaceholderPage title="Careers at BoxBuddy" message="Want to join our mission? We're always looking for passionate people to join our team. Check back soon for job openings." onNavigate={navigate}/>;
      case 'privacy':
        return <PlaceholderPage title="Privacy Policy" message="Your privacy is important to us. This page will detail how we collect, use, and protect your personal information. (Content to be added)" onNavigate={navigate} />;
      case 'terms':
        return <PlaceholderPage title="Terms of Service" message="This page will outline the terms and conditions for using our website and services. (Content to be added)" onNavigate={navigate} />;
      case 'home':
      default:
        return <HomePage 
          products={products}
          hasActiveSubscription={hasActiveSubscription}
          addToCart={addToCart}
          onViewProduct={handleViewProduct}
          setCurrentPage={navigate}
        />;
    }
  }

  return (
    <div className="min-h-screen font-sans flex flex-col bg-slate-50">
      <Header 
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        currentUser={currentUser}
        onLogout={handleLogout}
        setCurrentPage={navigate}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer setCurrentPage={navigate} />
      {isModalOpen && isAdmin && (
        <Modal onClose={handleCloseModal}>
          <ProductForm 
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
      {showCancelConfirm && (
        <Modal onClose={handleCloseCancelModal}>
          <div className="text-center p-4">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Cancel Subscription?</h2>
            <p className="text-slate-600 mb-8">
                Are you sure you want to cancel your active subscription? You will be refunded for the remaining 3 weeks of your plan. This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
                <button 
                    onClick={handleCloseCancelModal}
                    className="bg-white py-2 px-6 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                    Keep Subscription
                </button>
                <button 
                    onClick={handleConfirmCancelSubscription}
                    className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Yes, Cancel It
                </button>
            </div>
          </div>
        </Modal>
      )}
      {isDeleteAccountConfirmOpen && (
        <Modal onClose={handleCloseDeleteAccountModal}>
            <div className="text-center p-4">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Delete Your Account?</h2>
            <p className="text-slate-600 mb-8">
                Are you sure you want to permanently delete your account? This action is irreversible and will cancel any active subscription.
            </p>
            <div className="flex justify-center space-x-4">
                <button 
                    onClick={handleCloseDeleteAccountModal}
                    className="bg-white py-2 px-6 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                    Keep Account
                </button>
                <button 
                    onClick={handleConfirmDeleteAccount}
                    className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Yes, Delete It
                </button>
            </div>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default App;