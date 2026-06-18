# CineFlow Algorithm Overview

This README documents two core algorithms used in CineFlow:

1. Mood-based movie selection
2. Seat preview and selection

## 1. Mood-Based Movie Selection

Mood-based movie selection helps users discover movies that match their current mood by filtering available movies according to mood tags and related metadata.

### Algorithm

1. Collect the user's mood input.
2. Define a mood-to-genre mapping or mood keyword list.
3. Scan the movie catalog for matching mood values.
4. Score each movie based on mood relevance and fallback to genre if needed.
5. Sort and return the highest scoring results.

### Pseudocode

```
function selectMoviesByMood(userMood, movies):
    moodPreferences = {
        "adventure": ["Adventure", "Action", "Sci-Fi"],
        "relax": ["Romance", "Drama", "Comedy"],
        "thrill": ["Horror", "Thriller", "Action"],
        "inspired": ["Drama", "Biography", "Sci-Fi"],
        "nostalgic": ["Classic", "Drama", "Romance"]
    }

    moodGenres = moodPreferences[userMood.toLowerCase()] || []

    if moodGenres is empty:
        return movies

    results = []
    for movie in movies:
        score = 0
        if movie.mood and movie.mood.toLowerCase() == userMood.toLowerCase():
            score += 20
        if movie.genre and movie.genre.toLowerCase() in moodGenres.map(g => g.toLowerCase()):
            score += 10
        if movie.description contains userMood keyword:
            score += 5
        if movie.title contains userMood keyword:
            score += 3
        if score > 0:
            results.append({ movie, score })

    sort results by score descending
    return results.map(item => item.movie)
```

### Notes
- Use exact mood tags when available (`movie.mood`).
- Fall back to genre matches for broader recommendations.
- Optionally include user history or ratings to refine ordering.

## 2. Seat Preview and Selection

Seat preview provides a visual view of available seats, highlights selected ones, and calculates price dynamically based on seat type.

### Algorithm

1. Build a seat map grid with seat state values: available, reserved, selected, premium, couple.
2. Render the seat layout in the UI.
3. Listen for seat clicks and toggle selection state.
4. Update selected seat list and pricing summary.
5. Prevent selection of unavailable or occupied seats.

### Pseudocode

```
function initializeSeatMap(seats):
    for seat in seats:
        createSeatElement(seat.id, seat.type, seat.status)
        if seat.status == "occupied":
            disableSeatInteraction(seat.id)
        else:
            seatElement.onclick = () => handleSeatToggle(seat.id)

function handleSeatToggle(seatId):
    seat = findSeatById(seatId)
    if seat.status == "occupied":
        return

    if seat.isSelected:
        seat.isSelected = false
        removeFromSelectedSeats(seatId)
    else:
        seat.isSelected = true
        addToSelectedSeats(seatId)

    updateSeatPreview()
    updatePriceSummary()

function updateSeatPreview():
    for seat in seats:
        element = getSeatElement(seat.id)
        if seat.isSelected:
            element.className = "seat selected"
        else if seat.status == "occupied":
            element.className = "seat occupied"
        else if seat.type == "premium":
            element.className = "seat premium"
        else if seat.type == "couple":
            element.className = "seat couple"
        else:
            element.className = "seat available"

function updatePriceSummary():
    total = 0
    for seatId in selectedSeats:
        seat = findSeatById(seatId)
        if seat.type == "premium":
            total += basePrice + premiumSurcharge
        else if seat.type == "couple":
            total += basePrice * 2
        else:
            total += basePrice

    displaySelectedSeatCount(selectedSeats.length)
    displayTotalPrice(total)
```

### Notes
- Use seat type metadata to calculate price differences.
- Ensure the preview updates instantly after every seat toggle.
- Keep `occupied` seats unclickable and visually distinct.

## How to Use
- Place this README at the project root for documentation.
- These algorithms can be adapted to the existing CineFlow UI logic in `script.js`.
- The mood selection algorithm can also be extended with user preference scoring and historical behavior.
