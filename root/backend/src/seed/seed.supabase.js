// backend/src/seed/seed.supabase.js
const { supabase } = require('../db/pool');

async function run() {
  const sample = [
    {
      transaction_id: 'TXN0001', date: '2023-09-26', customer_id: 'CUST12016',
      customer_name: 'Neha Yadav', phone_number: '+919123456789', gender: 'Female', age: 25,
      customer_region: 'South', product_id: 'PROD0001', product_name: 'Blue Shirt',
      product_category: 'Clothing', tags: 'shirt,blue', quantity: 1, price_per_unit: 1000,
      discount_percentage: 0, total_amount: 1000, final_amount: 1000, payment_method: 'Card',
      order_status: 'Delivered', delivery_type: 'Home', store_id: 'STORE01', store_location: 'Bengaluru',
      salesperson_id: 'EMP001', employee_name: 'Harsh Agrawal'
    },
    {
      transaction_id: 'TXN0002', date: '2023-09-27', customer_id: 'CUST12017',
      customer_name: 'Amit Sharma', phone_number: '+919876543210', gender: 'Male', age: 30,
      customer_region: 'North', product_id: 'PROD0002', product_name: 'Running Shoes',
      product_category: 'Footwear', tags: 'shoes,sports', quantity: 2, price_per_unit: 2500,
      discount_percentage: 10, total_amount: 5000, final_amount: 4500, payment_method: 'UPI',
      order_status: 'Delivered', delivery_type: 'StorePick', store_id: 'STORE02', store_location: 'Delhi',
      salesperson_id: 'EMP002', employee_name: 'Anurag Yadav'
    }
  ];

  const { data, error } = await supabase
    .from('transactions')
    .insert(sample);

  if (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } else {
    console.log('Seed complete', data.length);
    process.exit(0);
  }
}

run();
