
export const loginUser = async (username, password) => {
    const response = await fetch ("https://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({username, password}),
    });
    if(!response)
        throw new Error("Username or password is incorrect.");

    return await response.json();
};

export const signUp = async (username, password, confirmPassword) => {
    const response = await fetch("https://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, confirmPassword }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unexpected error occurred.");
      }
    
      return response.json();
}