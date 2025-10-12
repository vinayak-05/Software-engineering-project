import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateCartItem, removeFromCart, loading } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(itemId, newQuantity);
  };

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
  };

  const handleCheckout = () => {
    alert('Checkout functionality not implemented yet. Total: ₹' + cart.total);
  };

  return (
    <div className='container mx-auto p-4 space-y-6'>
      <h2 className='text-3xl font-bold text-center'>Your Cart</h2>
      {cart.items.length === 0 ? (
        <p className='text-center text-gray-500'>Your cart is empty.</p>
      ) : (
        <div className='space-y-4'>
          {cart.items.map((item) => (
            <div key={item._id} className='flex items-center justify-between border rounded-lg p-4'>
              <div className='flex items-center space-x-4'>
                {item.crop.image && (
                  <img src={item.crop.image} alt={item.crop.name} className='w-16 h-16 object-cover rounded' />
                )}
                <div>
                  <h3 className='font-semibold'>{item.crop.name}</h3>
                  <p className='text-sm text-gray-500'>₹{item.crop.price} each</p>
                  {item.crop.description && <p className='text-xs text-gray-400 mt-1'>{item.crop.description}</p>}
                </div>
              </div>
              <div className='flex items-center space-x-4'>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className='px-2 py-1 bg-gray-200 rounded'
                    disabled={loading}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className='px-2 py-1 bg-gray-200 rounded'
                    disabled={loading}
                  >
                    +
                  </button>
                </div>
                <p className='font-semibold'>₹{item.crop.price * item.quantity}</p>
                <button
                  onClick={() => handleRemove(item._id)}
                  className='text-red-500 hover:text-red-700'
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className='text-right'>
            <p className='text-xl font-bold'>Total: ₹{cart.total}</p>
            <button
              onClick={handleCheckout}
              className='mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600'
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
