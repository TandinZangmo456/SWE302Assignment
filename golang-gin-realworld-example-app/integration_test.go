package main

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"
    
    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/assert"
)

// Setup test router
func setupTestRouter() *gin.Engine {
    gin.SetMode(gin.TestMode)
    r := gin.Default()
    
    // Setup routes (simplified - in real app, use actual route setup)
    r.POST("/api/users", func(c *gin.Context) {
        // Mock registration
        c.JSON(http.StatusCreated, gin.H{
            "user": gin.H{
                "username": "testuser",
                "email":    "test@example.com",
                "token":    "mock-jwt-token",
            },
        })
    })
    
    r.POST("/api/users/login", func(c *gin.Context) {
        // Mock login
        c.JSON(http.StatusOK, gin.H{
            "user": gin.H{
                "username": "testuser",
                "email":    "test@example.com",
                "token":    "mock-jwt-token",
            },
        })
    })
    
    r.GET("/api/user", func(c *gin.Context) {
        // Mock get current user
        authHeader := c.GetHeader("Authorization")
        if authHeader != "Token mock-jwt-token" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
            return
        }
        c.JSON(http.StatusOK, gin.H{
            "user": gin.H{
                "username": "testuser",
                "email":    "test@example.com",
            },
        })
    })
    
    // Articles endpoints
    r.POST("/api/articles", func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader != "Token mock-jwt-token" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
            return
        }
        
        var input struct {
            Article struct {
                Title       string   `json:"title"`
                Description string   `json:"description"`
                Body        string   `json:"body"`
                TagList     []string `json:"tagList"`
            } `json:"article"`
        }
        
        if err := c.ShouldBindJSON(&input); err != nil {
            c.JSON(http.StatusUnprocessableEntity, gin.H{"errors": err.Error()})
            return
        }
        
        c.JSON(http.StatusCreated, gin.H{
            "article": gin.H{
                "slug":    "test-article-title",
                "title":   input.Article.Title,
                "body":    input.Article.Body,
                "tagList": input.Article.TagList,
            },
        })
    })
    
    r.GET("/api/articles", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "articles": []gin.H{
                {
                    "slug":    "test-article-1",
                    "title":   "Test Article 1",
                    "body":    "Content 1",
                    "tagList": []string{"go", "testing"},
                },
                {
                    "slug":    "test-article-2",
                    "title":   "Test Article 2",
                    "body":    "Content 2",
                    "tagList": []string{"backend"},
                },
            },
            "articlesCount": 2,
        })
    })
    
    // Article endpoints
    r.GET("/api/articles/:slug", func(c *gin.Context) {
        slug := c.Param("slug")
        c.JSON(http.StatusOK, gin.H{
            "article": gin.H{
                "slug":    slug,
                "title":   "Test Article " + slug,
                "body":    "Content for " + slug,
                "tagList": []string{"test"},
            },
        })
    })
    
    r.PUT("/api/articles/:slug", func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader != "Token mock-jwt-token" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
            return
        }
        c.JSON(http.StatusOK, gin.H{"article": gin.H{"updated": true}})
    })
    
    r.DELETE("/api/articles/:slug", func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader != "Token mock-jwt-token" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
            return
        }
        c.JSON(http.StatusOK, gin.H{"deleted": true})
    })
    
    // Favorite endpoints
    r.POST("/api/articles/:slug/favorite", func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader != "Token mock-jwt-token" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
            return
        }
        c.JSON(http.StatusOK, gin.H{"article": gin.H{"favorited": true}})
    })
    
    r.DELETE("/api/articles/:slug/favorite", func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader != "Token mock-jwt-token" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
            return
        }
        c.JSON(http.StatusOK, gin.H{"article": gin.H{"favorited": false}})
    })
    
    return r
}

// Test 1: User Registration Integration Test
func TestUserRegistrationIntegration(t *testing.T) {
    r := setupTestRouter()
    
    registrationData := map[string]interface{}{
        "user": map[string]string{
            "username": "newuser",
            "email":    "new@example.com",
            "password": "password123",
        },
    }
    
    jsonData, _ := json.Marshal(registrationData)
    
    req, _ := http.NewRequest("POST", "/api/users", bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")
    
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusCreated, w.Code)
    
    var response map[string]interface{}
    json.Unmarshal(w.Body.Bytes(), &response)
    
    user := response["user"].(map[string]interface{})
    assert.Equal(t, "testuser", user["username"])
    assert.NotEmpty(t, user["token"])
}

// Test 2: User Login Integration Test
func TestUserLoginIntegration(t *testing.T) {
    r := setupTestRouter()
    
    loginData := map[string]interface{}{
        "user": map[string]string{
            "email":    "test@example.com",
            "password": "password123",
        },
    }
    
    jsonData, _ := json.Marshal(loginData)
    
    req, _ := http.NewRequest("POST", "/api/users/login", bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")
    
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusOK, w.Code)
    
    var response map[string]interface{}
    json.Unmarshal(w.Body.Bytes(), &response)
    
    user := response["user"].(map[string]interface{})
    assert.Equal(t, "testuser", user["username"])
    assert.NotEmpty(t, user["token"])
}

// Test 3: Get Current User (with authentication)
func TestGetCurrentUserWithAuth(t *testing.T) {
    r := setupTestRouter()
    
    req, _ := http.NewRequest("GET", "/api/user", nil)
    req.Header.Set("Authorization", "Token mock-jwt-token")
    
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusOK, w.Code)
    
    var response map[string]interface{}
    json.Unmarshal(w.Body.Bytes(), &response)
    
    user := response["user"].(map[string]interface{})
    assert.Equal(t, "testuser", user["username"])
    assert.Equal(t, "test@example.com", user["email"])
}

// Test 4: Get Current User (without authentication)
func TestGetCurrentUserWithoutAuth(t *testing.T) {
    r := setupTestRouter()
    
    req, _ := http.NewRequest("GET", "/api/user", nil)
    // No Authorization header
    
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// Test 5: Create Article with Authentication
func TestCreateArticleWithAuth(t *testing.T) {
    r := setupTestRouter()
    
    articleData := map[string]interface{}{
        "article": map[string]interface{}{
            "title":       "Test Article Title",
            "description": "Test Description",
            "body":        "Test body content here",
            "tagList":     []string{"go", "testing"},
        },
    }
    
    jsonData, _ := json.Marshal(articleData)
    
    req, _ := http.NewRequest("POST", "/api/articles", bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Token mock-jwt-token")
    
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusCreated, w.Code)
    
    var response map[string]interface{}
    json.Unmarshal(w.Body.Bytes(), &response)
    
    article := response["article"].(map[string]interface{})
    assert.Equal(t, "Test Article Title", article["title"])
    assert.Equal(t, "test-article-title", article["slug"])
    assert.Contains(t, article["tagList"], "go")
}

// Test 6: Create Article without Authentication
func TestCreateArticleWithoutAuth(t *testing.T) {
    r := setupTestRouter()
    
    articleData := map[string]interface{}{
        "article": map[string]interface{}{
            "title": "Test Article",
            "body":  "Test body",
        },
    }
    
    jsonData, _ := json.Marshal(articleData)
    
    req, _ := http.NewRequest("POST", "/api/articles", bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")
    // No Authorization header
    
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// Test 7: List Articles
func TestListArticles(t *testing.T) {
    r := setupTestRouter()
    
    req, _ := http.NewRequest("GET", "/api/articles", nil)
    
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusOK, w.Code)
    
    var response map[string]interface{}
    json.Unmarshal(w.Body.Bytes(), &response)
    
    articles := response["articles"].([]interface{})
    articlesCount := response["articlesCount"].(float64)
    
    assert.Equal(t, 2, len(articles))
    assert.Equal(t, float64(2), articlesCount)
    
    firstArticle := articles[0].(map[string]interface{})
    assert.Equal(t, "Test Article 1", firstArticle["title"])
}

// Test 8: Get Single Article
func TestGetSingleArticle(t *testing.T) {
    r := setupTestRouter()
    
    req, _ := http.NewRequest("GET", "/api/articles/test-slug", nil)
    
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusOK, w.Code)
    
    var response map[string]interface{}
    json.Unmarshal(w.Body.Bytes(), &response)
    
    article := response["article"].(map[string]interface{})
    assert.Equal(t, "test-slug", article["slug"])
    assert.Contains(t, article["title"].(string), "Test Article")
}

// Test 9: Update Article with Authentication
func TestUpdateArticleWithAuth(t *testing.T) {
    r := setupTestRouter()
    
    updateData := map[string]interface{}{
        "article": map[string]interface{}{
            "title": "Updated Title",
        },
    }
    
    jsonData, _ := json.Marshal(updateData)
    
    req, _ := http.NewRequest("PUT", "/api/articles/test-slug", bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Token mock-jwt-token")
    
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusOK, w.Code)
}

// Test 10: Update Article without Authentication
func TestUpdateArticleWithoutAuth(t *testing.T) {
    r := setupTestRouter()
    
    updateData := map[string]interface{}{
        "article": map[string]interface{}{
            "title": "Updated Title",
        },
    }
    
    jsonData, _ := json.Marshal(updateData)
    
    req, _ := http.NewRequest("PUT", "/api/articles/test-slug", bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")
    // No Authorization header
    
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// Test 11: Delete Article with Authentication
func TestDeleteArticleWithAuth(t *testing.T) {
    r := setupTestRouter()
    
    req, _ := http.NewRequest("DELETE", "/api/articles/test-slug", nil)
    req.Header.Set("Authorization", "Token mock-jwt-token")
    
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusOK, w.Code)
}

// Test 12: Delete Article without Authentication
func TestDeleteArticleWithoutAuth(t *testing.T) {
    r := setupTestRouter()
    
    req, _ := http.NewRequest("DELETE", "/api/articles/test-slug", nil)
    // No Authorization header
    
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// Test 13: Favorite Article
func TestFavoriteArticle(t *testing.T) {
    r := setupTestRouter()
    
    req, _ := http.NewRequest("POST", "/api/articles/test-slug/favorite", nil)
    req.Header.Set("Authorization", "Token mock-jwt-token")
    
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusOK, w.Code)
}

// Test 14: Unfavorite Article
func TestUnfavoriteArticle(t *testing.T) {
    r := setupTestRouter()
    
    req, _ := http.NewRequest("DELETE", "/api/articles/test-slug/favorite", nil)
    req.Header.Set("Authorization", "Token mock-jwt-token")
    
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusOK, w.Code)
}

// Test 15: Article operations without auth should fail
func TestArticleOperationsWithoutAuth(t *testing.T) {
    r := setupTestRouter()
    
    // Try to favorite without auth
    req, _ := http.NewRequest("POST", "/api/articles/test-slug/favorite", nil)
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    assert.Equal(t, http.StatusUnauthorized, w.Code)
    
    // Try to unfavorite without auth
    req, _ = http.NewRequest("DELETE", "/api/articles/test-slug/favorite", nil)
    w = httptest.NewRecorder()
    r.ServeHTTP(w, req)
    assert.Equal(t, http.StatusUnauthorized, w.Code)
}
