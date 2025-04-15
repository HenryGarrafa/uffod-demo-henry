import Cookies from 'js-cookie'

const API_BASE_URL = 'https://ufoodapi.herokuapp.com'

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data = await response.json()
    Cookies.set('token', data.token, { expires: 1 })
    localStorage.setItem('userId', data.id)
    return data
  } catch (error) {
    console.error('Login error:', error)
    throw new Error(error)
  }
}

export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: Cookies.get('token'),
      },
    })
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    Cookies.remove('token')
    localStorage.removeItem('selectedFavoriteListId')
    localStorage.removeItem('userId')
    localStorage.removeItem('user')
    window.location.reload()
    return true
  } catch (error) {
    console.error('Logout error:', error)
    throw new Error(error)
  }
}

export const register = async (name, email, password) => {
  try {
    const formData = new URLSearchParams()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)

    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })

    if (!response.ok) throw new Error('Signup failed')

    return await response.json()
  } catch (error) {
    console.error('Signup error:', error)
    throw error
  }
}

export const createDefaultFavoriteList = async () => {
  try {
    checkAuthenticated()

    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify({ name: 'My Favorites' }),
    })

    if (!response.ok) throw new Error('Failed to create default favorite list')

    return await response.json()
  } catch (error) {
    console.error('Error creating default favorite list:', error)
    return null
  }
}

export const getUserInfo = async () => {
  try {
    checkAuthenticated()

    const response = await fetch(`${API_BASE_URL}/tokenInfo`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data = await response.json()
    localStorage.setItem('user', JSON.stringify(data))
    return data
  } catch (error) {
    console.error('User info error:', error)
    return null
  }
}

export const getAllUsers = async (limit = 10, page = 0, q = '') => {
  try {
    checkAuthenticated()

    const response = await fetch(`${API_BASE_URL}/users?limit=${limit}&page=${page}&q=${q}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    })

    if (!response.ok) throw new Error('Failed to fetch users')

    return await response.json()
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export const getUserById = async (userId = localStorage.getItem('userId')) => {
  try {
    checkAuthenticated()

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    })

    if (!response.ok) throw new Error('Failed to fetch user details')

    return await response.json()
  } catch (error) {
    console.error('Error fetching user details:', error)
    return null
  }
}

export const getRestaurants = async (limit = 10, page = 0, filters = {}) => {
  try {
    // Remove for TP3
    let loggedOut = ''
    if (!isAuthenticated()) {
      loggedOut = '/unsecure'
    }

    const params = new URLSearchParams({
      limit,
      page,
      ...(filters.q && { q: filters.q }),
      ...(filters.genres && filters.genres.length > 0 && { genres: filters.genres }),
      ...(filters.price_range && { price_range: filters.price_range }),
      ...(filters.lat && { lat: filters.lat }),
      ...(filters.lon && { lon: filters.lon }),
    })
    const response = await fetch(`${API_BASE_URL}${loggedOut}/restaurants?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    })

    if (!response.ok) throw new Error('Failed to get restaurants')

    return await response.json()
  } catch (error) {
    console.error('Error getting restaurants', error)
    return null
  }
}

export const getRestaurantById = async (restaurantId) => {
  try {
    // Remove for TP3
    let loggedOut = ''
    if (!isAuthenticated()) {
      loggedOut = '/unsecure'
    }

    const response = await fetch(`${API_BASE_URL}${loggedOut}/restaurants/${restaurantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    })
    if (!response.ok) throw new Error('Failed to fetch restaurant details')

    return await response.json()
  } catch (error) {
    console.error(`Error fetching restaurant ${restaurantId}:`, error)
    return null
  }
}

export const getUserVisits = async (
  userId = localStorage.getItem('userId'),
  limit = 10,
  page = 0,
) => {
  try {
    checkAuthenticated()

    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/restaurants/visits?limit=${limit}&page=${page}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch user visits')
    }

    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Error fetching user visits:', error)
    return []
  }
}

export const getVisitsById = async (userId = localStorage.getItem('userId'), visitId) => {
  try {
    checkAuthenticated()

    const response = await fetch(`${API_BASE_URL}/users/${userId}/restaurants/visits/${visitId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    })
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Error fetching user visits:', error)
  }
}

export const getVisitsByRestaurantId = async (
  restaurantId,
  userId = localStorage.getItem('userId'),
) => {
  try {
    checkAuthenticated()

    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/restaurants/${restaurantId}/visits`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      },
    )
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching user visits:', error)
  }
}

export const createVisit = async (
  userId = localStorage.getItem('userId'),
  restaurantId,
  comment,
  rating,
  date,
) => {
  try {
    checkAuthenticated()

    const response = await fetch(`${API_BASE_URL}/users/${userId}/restaurants/visits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify({
        restaurant_id: restaurantId,
        comment: comment,
        rating: rating,
        date: date,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to create visit: ${response.status} - ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating user visit:', error)
  }
}

export const createFavoriteList = async (listName) => {
  try {
    checkAuthenticated()

    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify({ name: listName }),
    })

    if (!response.ok) throw new Error('Failed to create favorite list')

    return await response.json()
  } catch (error) {
    console.error('Error creating favorite list:', error)
    return null
  }
}

export const deleteFavoriteList = async (listId) => {
  try {
    checkAuthenticated()

    const response = await fetch(`${API_BASE_URL}/favorites/${listId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    })

    if (!response.ok) throw new Error('Failed to delete favorite list')
    return true
  } catch (error) {
    console.error('Error deleting favorite list:', error)
    return false
  }
}

export const updateFavoriteList = async (listId, newName) => {
  checkAuthenticated()

  const response = await fetch(`${API_BASE_URL}/favorites/${listId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName }),
  })

  if (!response.ok) throw new Error('Failed to modify favorite list')

  return true
}

export const getFavoriteRestaurants = async (listId) => {
  try {
    if (!isAuthenticated()) {
      return null
    }

    if (!listId) throw new Error('No favorite list selected.')

    const response = await fetch(`${API_BASE_URL}/favorites/${listId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    })

    if (!response.ok) throw new Error('Failed to fetch favorites')

    const data = await response.json()
    return data.restaurants
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return []
  }
}

export const getUserFavoriteLists = async () => {
  try {
    checkAuthenticated()

    const userInfoResponse = await fetch(`${API_BASE_URL}/tokenInfo`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    })

    if (!userInfoResponse.ok) throw new Error('Failed to fetch user info')
    const userData = await userInfoResponse.json()
    const userId = userData.id

    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    })

    if (!response.ok) throw new Error('Failed to fetch favorite lists')

    const data = await response.json()

    return Array.isArray(data.items)
      ? data.items.map((list) => ({ id: list.id, name: list.name }))
      : []
  } catch (error) {
    console.error('Error fetching favorite lists:', error)
    return []
  }
}

export const addFavoriteRestaurant = async (listId, restaurantId) => {
  try {
    checkAuthenticated()

    const response = await fetch(`${API_BASE_URL}/favorites/${listId}/restaurants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify({ id: restaurantId }),
    })

    if (!response.ok) throw new Error('Failed to add favorite')
    return await response.json()
  } catch (error) {
    console.error('Error adding favorite:', error)
    return null
  }
}

export const removeFavoriteRestaurant = async (listId, restaurantId) => {
  try {
    checkAuthenticated()

    const response = await fetch(
      `${API_BASE_URL}/favorites/${listId}/restaurants/${restaurantId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      },
    )

    if (!response.ok) throw new Error('Failed to remove favorite')
    return true
  } catch (error) {
    console.error('Error removing favorite:', error)
    return false
  }
}

export const getSimilarRestaurants = async (restaurantId, currentRestaurant) => {
  try {
    let loggedOut = ''
    if (!isAuthenticated()) {
      loggedOut = '/unsecure'
    }

    const genres = currentRestaurant.genres || []
    if (!genres.length) return []

    const coordinates = currentRestaurant.location?.coordinates
    const lat = coordinates?.length > 0 ? coordinates[1] : null
    const lon = coordinates?.length > 0 ? coordinates[0] : null

    const params = new URLSearchParams({
      limit: 10,
      page: 0,
      genres: genres.join(','),
      price_range: currentRestaurant.price_range || '',
    })

    if (lat && lon) {
      params.append('lat', lat)
      params.append('lon', lon)
    }

    const response = await fetch(`${API_BASE_URL}${loggedOut}/restaurants?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    })

    if (!response.ok) throw new Error('Failed to get similar restaurants')

    const data = await response.json()

    const filteredRestaurants = (data.items || []).filter(
      (restaurant) => restaurant.id !== restaurantId,
    )

    const sortedRestaurants = filteredRestaurants.sort((a, b) => {
      const aMatches = (a.genres || []).filter((g) => genres.includes(g)).length
      const bMatches = (b.genres || []).filter((g) => genres.includes(g)).length

      if (bMatches !== aMatches) {
        return bMatches - aMatches
      }

      return b.rating - a.rating
    })

    return sortedRestaurants.slice(0, 5)
  } catch (error) {
    console.error('Error getting similar restaurants', error)
    return []
  }
}

export const followUser = async (userId) => {
  try {
    checkAuthenticated()

    const response = await fetch(`${API_BASE_URL}/follow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify({ id: userId }),
    })

    if (!response.ok) throw new Error('Failed to follow user')
    return await response.json()
  } catch (error) {
    console.error('Error following user:', error)
    return null
  }
}

export const unfollowUser = async (userId) => {
  try {
    checkAuthenticated()

    const response = await fetch(`${API_BASE_URL}/follow/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    })

    if (!response.ok) throw new Error('Failed to unfollow user')
    return await response.json()
  } catch (error) {
    console.error('Error unfollowing user:', error)
    return null
  }
}

export const isAuthenticated = () => {
  return !!Cookies.get('token')
}

export const checkAuthenticated = () => {
  const token = Cookies.get('token')
  if (!token) throw new Error('User must be logged in.')
}
