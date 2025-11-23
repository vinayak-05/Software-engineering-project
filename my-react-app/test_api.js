// Test script for price prediction API
const fetch = require('node-fetch');

async function testPricePrediction() {
  try {
    const response = await fetch('http://localhost:5000/api/pricing/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        crop: 'Tomato',
        location: 'Bangalore',
        quantity: 1
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (data.pricePerKg && data.pricePerKg !== 0) {
      console.log('\n✅ SUCCESS! Price prediction is working!');
      console.log(`   Price per kg: ₹${data.pricePerKg}`);
      console.log(`   Total price: ₹${data.totalPrice}`);
    } else {
      console.log('\n❌ ERROR! Price is 0 or missing');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPricePrediction();
