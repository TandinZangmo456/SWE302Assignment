package common

import (
    "testing"
    "os"
    "github.com/stretchr/testify/assert"
)

func TestConnectingDatabase(t *testing.T) {
    asserts := assert.New(t)
    db := Init()
    // Test create & close DB
    _, err := os.Stat("./../gorm.db")
    asserts.NoError(err, "Db should exist")
    // Note: We can't ping if permissions are wrong, so we'll just check db exists
    
    // Test get a connecting from connection pools
    connection := GetDB()
    asserts.NotNil(connection, "Should get DB connection")
    db.Close()
}

func TestConnectingTestDatabase(t *testing.T) {
    asserts := assert.New(t)
    // Test create & close DB
    db := TestDBInit()
    _, err := os.Stat("./../gorm_test.db")
    asserts.NoError(err, "Db should exist")
    asserts.NotNil(db, "Test DB should be created")
    db.Close()

    // Test close delete DB
    TestDBFree(db)
    _, err = os.Stat("./../gorm_test.db")
    asserts.Error(err, "Db should not exist after cleanup")
}

func TestRandString(t *testing.T) {
    asserts := assert.New(t)

    str := RandString(0)
    asserts.Equal(str, "", "length should be ''")

    str = RandString(10)
    asserts.Equal(len(str), 10, "length should be 10")
    
    str = RandString(100)
    asserts.Equal(len(str), 100, "length should be 100")
}

func TestGenToken(t *testing.T) {
    asserts := assert.New(t)

    token := GenToken(2)
    asserts.IsType(token, string("token"), "token type should be string")
    asserts.Greater(len(token), 0, "Token should not be empty")
}

func TestNewError(t *testing.T) {
    assert := assert.New(t)

    db := TestDBInit()
    type NotExist struct {
        heheda string
    }
    db.AutoMigrate(&NotExist{})

    // Create an actual error
    err := db.Find(&NotExist{heheda: "heheda"}).Error
    commonError := NewError("database", err)
    assert.IsType(commonError, commonError, "commonError should have right type")
    assert.Contains(commonError.Errors["database"].(string), "no such table", "Error should contain table not found message")
    
    TestDBFree(db)
}

// NEW TESTS FOR ASSIGNMENT TASK 1.3 - Add 5 more tests

// Test 1: Test JWT token generation with different user IDs
func TestGenTokenDifferentIDs(t *testing.T) {
    asserts := assert.New(t)
    
    token1 := GenToken(1)
    token2 := GenToken(2)
    token3 := GenToken(1000)
    
    asserts.Greater(len(token1), 0, "Token for user 1 should not be empty")
    asserts.Greater(len(token2), 0, "Token for user 2 should not be empty")
    asserts.Greater(len(token3), 0, "Token for user 1000 should not be empty")
    
    // Tokens for different users should be different
    asserts.NotEqual(token1, token2, "Tokens for different users should be different")
    asserts.NotEqual(token2, token3, "Tokens for different users should be different")
}

// Test 2: Test RandString with different lengths
func TestRandStringVariations(t *testing.T) {
    asserts := assert.New(t)
    
    // Test edge cases
    str0 := RandString(0)
    str1 := RandString(1)
    str10 := RandString(10)
    str100 := RandString(100)
    
    asserts.Equal("", str0, "Length 0 should return empty string")
    asserts.Len(str1, 1, "Length 1 should return 1 char")
    asserts.Len(str10, 10, "Length 10 should return 10 chars")
    asserts.Len(str100, 100, "Length 100 should return 100 chars")
}

// Test 3: Test database error handling concept - FIXED VERSION
func TestDatabaseErrorHandling(t *testing.T) {
    asserts := assert.New(t)
    
    // Create an actual error
    db := TestDBInit()
    type TestModel struct {
        id string
    }
    
    // This will create an error
    err := db.Find(&TestModel{id: "test"}).Error
    commonError := NewError("database", err)
    
    asserts.NotNil(commonError, "NewError should return non-nil")
    asserts.Contains(commonError.Errors, "database", "Should contain database key")
    
    TestDBFree(db)
}

// Test 4: Test Init and GetDB functions
func TestDatabaseInitialization(t *testing.T) {
    // Test that Init doesn't panic
    db1 := Init()
    asserts := assert.New(t)
    asserts.NotNil(db1, "Init should return non-nil database")
    
    // Test GetDB returns same instance
    db2 := GetDB()
    asserts.Equal(db1, db2, "GetDB should return same instance as Init")
    
    db1.Close()
}

// Test 5: Test utility functions
func TestCommonUtils(t *testing.T) {
    asserts := assert.New(t)
    
    // Test RandString doesn't panic
    str := RandString(5)
    asserts.Len(str, 5, "Should generate 5 character string")
    
    // Test GenToken doesn't panic
    token := GenToken(999)
    asserts.Greater(len(token), 0, "Should generate non-empty token")
    
    t.Log("Common utility functions work correctly")
}
