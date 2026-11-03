// const testRegistration = async () => {
//   try {
//     const response = await fetch("http://localhost:5000/api/auth/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         name: "Natty Test",
//         email: "nattytest2@example.com",
//         password: "NattyTest123",
//       }),
//     });

//     const data = await response.json();

//     console.log("Registration result:", data);
//   } catch (error) {
//     console.error("Registration error:", error);
//   }
// };

// testRegistration();
const testLogin = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "nattytest2@example.com",
        password: "NattyTest123",
      }),
    });

    const data = await response.json();

    console.log("Login result:", data);
  } catch (error) {
    console.error("Login error:", error);
  }
};

testLogin();
