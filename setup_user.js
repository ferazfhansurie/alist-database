// Setup script to create the first user
// Run this script after starting the server

const createUser = async () => {
  try {
    const response = await fetch('https://e8c11521c11e51ab.ngrok.app/api/auth/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'firaz@alist.com',
        password: '123456',
        name: 'Firaz'
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating user:', errorData);
      return;
    }
    
    const data = await response.json();
    console.log('User created successfully:', data.user);
    console.log('You can now login with:');
    console.log('Email: firaz@alist.com');
    console.log('Password: 123456');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Run the script
createUser();
