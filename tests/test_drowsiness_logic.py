from backend.services.drowsiness_service import eye_aspect_ratio


def test_ear_calculation_logic():
    open_eye = [(0, 0), (1, 3), (2, 3), (4, 0), (2, 2), (1, 2)]  # coordinates for open eyes
    closed_eye = [(0, 0), (1, 1), (2, 1), (4, 0), (2, 1), (1, 1)]  # coordinates for closed eyes

    
    ear_open = eye_aspect_ratio(open_eye)
    
    ear_closed = eye_aspect_ratio(closed_eye)

    assert ear_open > ear_closed
    assert ear_open > 0
    assert ear_closed >= 0
