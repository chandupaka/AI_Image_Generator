const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match!',
      });
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname, email, password })
      });

      const data = await res.json();
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Registered Successfully!',
          text: 'Redirecting to login...',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          window.location.href = 'login.html';
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed!',
          text: data.error || 'Something went wrong.',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Server Error!',
        text: 'Unable to connect to backend.',
      });
    }
  });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Redirecting...',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          window.top.location.href = 'https://ai-image-generator-brown-nu.vercel.app/';
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed!',
          text: data.error || 'Invalid email or password.',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Server Error!',
        text: 'Unable to connect to backend.',
      });
    }
  });
}
