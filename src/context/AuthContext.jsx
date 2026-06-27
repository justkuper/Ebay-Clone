import { createContext, useContext, useState, useEffect } from 'react'

// Amplify imports — uncomment after running `npx ampx sandbox`
// import { getCurrentUser, signIn, signOut, signUp, confirmSignUp } from 'aws-amplify/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      // const currentUser = await getCurrentUser()
      // setUser(currentUser)
      // Mock: check localStorage for demo
      const saved = localStorage.getItem('ebay_clone_user')
      if (saved) setUser(JSON.parse(saved))
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    // Real: const { isSignedIn } = await signIn({ username: email, password })
    // Mock implementation for demo:
    const mockUser = {
      userId: `user_${Date.now()}`,
      username: email,
      signInDetails: { loginId: email },
      attributes: {
        given_name: email.split('@')[0],
        family_name: 'User',
        email,
      },
    }
    setUser(mockUser)
    localStorage.setItem('ebay_clone_user', JSON.stringify(mockUser))
    return mockUser
  }

  async function register(email, password, firstName, lastName) {
    // Real: await signUp({ username: email, password, options: { userAttributes: { given_name: firstName, family_name: lastName, email } } })
    const mockUser = {
      userId: `user_${Date.now()}`,
      username: email,
      attributes: { given_name: firstName, family_name: lastName, email },
    }
    setUser(mockUser)
    localStorage.setItem('ebay_clone_user', JSON.stringify(mockUser))
    return mockUser
  }

  async function logout() {
    // Real: await signOut()
    setUser(null)
    localStorage.removeItem('ebay_clone_user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
