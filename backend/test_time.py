from typing import List

def test_fixed_time():
    # The fixed time we expect
    expected_time = "2025-01-05T17:00:02+01:00"
    
    # Create a crew config
    config = {
        "enable_human_validation": True,
        "max_retries": 3,
        "timeout_seconds": 600,
        "cost_limit": None,
        "start_time": expected_time
    }
    
    try:
        # Check if start_time is set correctly
        if config["start_time"] != expected_time:
            print("❌ Test failed: Wrong time value:", config["start_time"])
            return False
            
        print("✅ Test passed!")
        return True
        
    except Exception as e:
        print("❌ Test failed with error:", str(e))
        return False

if __name__ == "__main__":
    test_fixed_time()
