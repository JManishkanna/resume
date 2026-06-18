const defaultMovies = [
    {
        id: 1,
        title: "Dune: Part Two",
        genre: "Sci-Fi",
        price: 350,
        rating: 4.8,
        duration: "2h 46m",
        director: "Denis Villeneuve",
        cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
        description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
        image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1470&auto=format&fit=crop",
        trailer: "https://www.youtube.com/embed/1gIWd4kF623",
        hero: true
    },
    {
        id: 2,
        title: "Interstellar",
        genre: "Sci-Fi",
        price: 250,
        rating: 4.9,
        duration: "2h 49m",
        director: "Christopher Nolan",
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth faces a global famine.",
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1472&auto=format&fit=crop",
        trailer: "https://www.youtube.com/embed/zSWdZVtXT7E",
        hero: true
    },
    {
        id: 3,
        title: "Oppenheimer",
        genre: "Drama",
        price: 300,
        rating: 4.7,
        duration: "3h 00m",
        director: "Christopher Nolan",
        cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon"],
        description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
        image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1470&auto=format&fit=crop",
        trailer: "https://www.youtube.com/embed/bwM4QF8Mz3Q",
        hero: true
    },
    {
        id: 4,
        title: "The Dark Knight",
        genre: "Action",
        price: 200,
        rating: 4.9,
        duration: "2h 32m",
        director: "Christopher Nolan",
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability.",
        image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1470&auto=format&fit=crop",
        trailer: "https://www.youtube.com/embed/YoHD9XEInc0",
        hero: false
    },
    {
        id: 5,
        title: "Inception",
        genre: "Sci-Fi",
        price: 250,
        rating: 4.8,
        duration: "2h 28m",
        director: "Christopher Nolan",
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        image: "https://images.unsplash.com/photo-1542204112-4043f6511099?q=80&w=1470&auto=format&fit=crop",
        trailer: "https://www.youtube.com/embed/2AUmvWm5ZDQ",
        hero: false
    },
    {
        id: 6,
        title: "John Wick",
        genre: "Action",
        price: 180,
        rating: 4.6,
        duration: "1h 41m",
        director: "Chad Stahelski",
        cast: ["Keanu Reeves", "Michael Nyqvist", "Alfie Allen"],
        description: "An ex-hit-man comes out of retirement to track down the gangsters that took everything from him, including his chance at a fresh start.",
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1470&auto=format&fit=crop",
        trailer: "https://www.youtube.com/embed/2JCzwPcpY-s",
        hero: false
    }
];

let movies = [];
const storedMovies = localStorage.getItem('cineflow_movies_data');
if (storedMovies) {
    const parsedMovies = JSON.parse(storedMovies);
    movies = parsedMovies.map(movie => {
        const defaultMovie = defaultMovies.find(m => m.id === movie.id) || {};
        return {
            ...defaultMovie,
            ...movie,
            trailer: normalizeTrailerUrl(movie.trailer || defaultMovie.trailer)
        };
    });
    localStorage.setItem('cineflow_movies_data', JSON.stringify(movies));
} else {
    movies = [...defaultMovies];
    localStorage.setItem('cineflow_movies_data', JSON.stringify(movies));
}

const defaultTheaters = [
    {
        id: 1,
        name: "PVR: Citi Mall, Andheri (W)",
        location: "Mumbai",
        features: ["4K Dolby Atmos", "Recliners"],
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1517604401871-10c929021bd0?q=80&w=1470&auto=format&fit=crop",
        showtimes: ["08:30 AM", "11:40 AM", "03:10 PM", "08:05 PM"]
    },
    {
        id: 2,
        name: "PVR: Market City, Kurla",
        location: "Mumbai",
        features: ["IMAX Laser", "Dolby Atmos"],
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1470&auto=format&fit=crop",
        showtimes: ["11:30 AM", "05:10 PM", "09:45 PM"]
    },
    {
        id: 3,
        name: "Movietime: The Hub, Goregaon",
        location: "Mumbai",
        features: ["Standard 2K", "Cafeteria"],
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?q=80&w=1632&auto=format&fit=crop",
        showtimes: ["01:00 PM", "07:00 PM"]
    }
];

let theaters = [];
const storedTheaters = localStorage.getItem('cineflow_theaters_data');
if (storedTheaters) {
    theaters = JSON.parse(storedTheaters);
} else {
    theaters = [...defaultTheaters];
    localStorage.setItem('cineflow_theaters_data', JSON.stringify(theaters));
}

let currentSlide = 0;
let selectedSeats = [];
let addonTotal = 0;
let selectedAddons = [];
let currentMovie = null;
let currentBookingInfo = { theater: '', time: '' };
let selectedParking = null;

const slider = document.getElementById('main-slider');
const movieGrid = document.getElementById('movie-grid');
const theaterGrid = document.getElementById('theater-grid');

function getEl(id) { return document.getElementById(id); }

function normalizeTrailerUrl(url) {
    if (!url || typeof url !== 'string') return null;
    try {
        const normalizedUrl = url.trim();
        let videoId = null;
        const parsed = new URL(normalizedUrl, window.location.origin);
        const hostname = parsed.hostname.toLowerCase();

        if (hostname.includes('youtube.com')) {
            if (parsed.pathname.startsWith('/watch')) {
                videoId = parsed.searchParams.get('v');
            } else if (parsed.pathname.startsWith('/embed/')) {
                videoId = parsed.pathname.split('/embed/')[1];
            }
        } else if (hostname === 'youtu.be') {
            videoId = parsed.pathname.slice(1);
        }

        if (!videoId) return normalizedUrl;
        const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
        embedUrl.searchParams.set('rel', '0');
        return embedUrl.toString();
    } catch (err) {
        return url;
    }
}

function closeModal(modalId) {
    const m = getEl(modalId);
    if (m) m.classList.remove('active');
    document.body.style.overflow = 'auto';
}

window.updatePointsUI = function() {
    let pts = parseInt(localStorage.getItem('cineflow_loyalty_points')) || 0;
    document.querySelectorAll('.points-badge').forEach(badge => {
        badge.innerText = pts + " pts";
    });
};

window.updateAuthButton = function() {
    const user = JSON.parse(localStorage.getItem('cineflow_user') || 'null');
    const btn = document.querySelector('.navbar .btn-primary[onclick*="login"]');
    if (!btn) return;

    if (user) {
        const firstName = user.name.split(' ')[0];
        const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
        
        const accountEl = document.createElement('div');
        accountEl.className = 'account-menu-wrap';
        accountEl.innerHTML = `
            <button class="account-btn" onclick="toggleAccountMenu(event)">
                <span class="account-avatar">${initials}</span>
                <span class="account-name">${firstName}</span>
                <i data-lucide="chevron-down" class="account-chevron"></i>
            </button>
            <div class="account-dropdown" id="accountDropdown">
                <div class="account-dropdown-header">
                    <div class="account-avatar-lg">${initials}</div>
                    <div>
                        <div class="account-full-name">${user.name}</div>
                        <div class="account-email">${user.email}</div>
                    </div>
                </div>
                <div class="account-dropdown-divider"></div>
                <a href="bookings.html" class="account-dropdown-item">
                    <i data-lucide="ticket"></i> My Bookings
                </a>
                <a href="notifications.html" class="account-dropdown-item">
                    <i data-lucide="bell"></i> Notifications
                </a>
                <a href="rewards.html" class="account-dropdown-item">
                    <i data-lucide="star"></i> My Rewards
                </a>
                <div class="account-dropdown-divider"></div>
                <button class="account-dropdown-item danger" onclick="logoutUser()">
                    <i data-lucide="log-out"></i> Sign Out
                </button>
            </div>
        `;
        btn.replaceWith(accountEl);
        if (window.lucide) lucide.createIcons();

        document.addEventListener('click', () => {
            const dd = document.getElementById('accountDropdown');
            if (dd) dd.classList.remove('open');
        });
    }
};

window.toggleAccountMenu = function(e) {
    e.stopPropagation();
    const dd = document.getElementById('accountDropdown');
    if (dd) dd.classList.toggle('open');
};

window.logoutUser = function() {
    localStorage.removeItem('cineflow_user');
    window.location.href = 'login.html';
};


document.addEventListener('DOMContentLoaded', () => {
    initCommon();
    updatePointsUI();
    updateAuthButton();

    if (typeof slider !== 'undefined' && slider) initSlider();
    if (typeof movieGrid !== 'undefined' && movieGrid) renderMovies();
    if (typeof theaterGrid !== 'undefined' && theaterGrid) renderTheaters();

    if (document.querySelector('.qr-container')) {
        generateTicketQRs();
    }

    initScrollReveal();
    if (typeof seatGrid !== 'undefined' && seatGrid) initSeatMap();
    initFilters();

    initDraggableModals();

    detectAndApplyAndroidView();
});

function detectAndApplyAndroidView() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
        document.body.classList.add('android-app-view');
        
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if(!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = "theme-color";
            document.head.appendChild(metaTheme);
        }
        metaTheme.content = "#0a0a0b"; 
    }
}

function initCommon() {
    updatePointsUI();

    window.onscroll = () => {
        const nav = document.querySelector('.navbar');
        if (!nav) return;
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 11, 0.95)';
        } else {
            nav.style.background = 'rgba(10, 10, 11, 0.3)';
        }
    };

    if (window.lucide) {
        lucide.createIcons();
    }

    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && this.target !== '_blank') {
                e.preventDefault();
                goToPage(href);
            }
        });
    });
}

window.goToPage = function(url) {
    document.body.classList.add('page-fade-out');
    setTimeout(() => {
        window.location.href = url;
    }, 400); // Wait for transition duration
};

function initDraggableModals() {
    document.querySelectorAll('.modal-content').forEach(content => {
        let isDragging = false;
        let startX, startY;
        let initialX, initialY;

        content.addEventListener('mousedown', (e) => {
            const noDragTags = ['INPUT', 'BUTTON', 'A', 'TEXTAREA', 'SELECT', 'OPTION'];
            if (
                noDragTags.includes(e.target.tagName) ||
                e.target.closest('button') ||
                e.target.closest('.seat-sections') ||
                e.target.closest('.addons-grid') ||
                e.target.closest('.theaters-list') ||
                e.target.closest('.cast-list') ||
                e.target.closest('.payment-methods') ||
                e.target.closest('.date-selector')
            ) {
                return;
            }

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const style = window.getComputedStyle(content);
            const matrix = new DOMMatrixReadOnly(style.transform !== 'none' ? style.transform : 'matrix(1, 0, 0, 1, 0, 0)');
            initialX = matrix.m41;
            initialY = matrix.m42;

            content.style.transition = 'none';
            content.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            content.style.transform = `translate(${initialX + dx}px, ${initialY + dy}px)`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                content.style.cursor = 'auto';
                document.body.style.userSelect = '';
                content.style.transition = 'transform 0.1s ease-out';
                setTimeout(() => {
                    content.style.transition = '';
                }, 100);
            }
        });

        content.addEventListener('dblclick', (e) => {
            if (
                e.target.closest('button') ||
                e.target.closest('input') ||
                e.target.closest('.seat-sections') ||
                e.target.closest('.addons-grid') ||
                e.target.closest('.date-selector')
            ) {
                return;
            }
            content.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
            content.style.transform = 'translate(0px, 0px)';
            setTimeout(() => {
                content.style.transition = '';
            }, 300);
        });
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class' && !mutation.target.classList.contains('active') && mutation.target.classList.contains('modal')) {
                   content.style.transform = '';
                }
            });
        });
        if(content.parentElement && content.parentElement.classList.contains('modal')){
            observer.observe(content.parentElement, { attributes: true });
        }
    });
}

window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        document.body.classList.remove('page-fade-out');
    }
});

let activeGenreFilter = null;   // null = All
let activeSearchQuery = '';     // current search string

function initFilters() {
    const filterContainer = document.getElementById('genre-filters');
    if (!filterContainer) return;

    const genreMap = {};
    movies.forEach(m => {
        genreMap[m.genre] = (genreMap[m.genre] || 0) + 1;
    });

    const allChip = buildChip('All', movies.length, true);
    filterContainer.appendChild(allChip);

    Object.entries(genreMap).sort().forEach(([genre, count]) => {
        filterContainer.appendChild(buildChip(genre, count, false));
    });
}

function buildChip(label, count, isActive) {
    const chip = document.createElement('span');
    chip.className = `filter-chip${isActive ? ' active' : ''}`;
    chip.dataset.genre = label;
    chip.innerHTML = `${label} <span class="chip-count">${count}</span>`;
    chip.onclick = () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeGenreFilter = label === 'All' ? null : label;
        applyMovieFilters();
    };
    return chip;
}

function handleMovieSearch(val) {
    activeSearchQuery = val.trim().toLowerCase();
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) clearBtn.style.display = activeSearchQuery ? 'flex' : 'none';
    applyMovieFilters();
}

function clearSearch() {
    const input = document.getElementById('movie-search');
    if (input) input.value = '';
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) clearBtn.style.display = 'none';
    activeSearchQuery = '';
    applyMovieFilters();
}

function applyMovieFilters() {
    let filtered = movies;

    if (activeGenreFilter) {
        filtered = filtered.filter(m => m.genre === activeGenreFilter);
    }

    if (activeSearchQuery) {
        filtered = filtered.filter(m =>
            m.title.toLowerCase().includes(activeSearchQuery) ||
            m.genre.toLowerCase().includes(activeSearchQuery)
        );
    }

    const heading = document.getElementById('movies-heading');
    if (heading) heading.textContent = activeGenreFilter ? `${activeGenreFilter} Movies` : 'All Movies';

    renderMovies(filtered);
}

function initSlider() {
    const heroMovies = movies.filter(m => m.hero);
    heroMovies.forEach((movie, index) => {
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}" class="slide-image" loading="lazy">
            <div class="slide-content">
                <h2>${movie.title}</h2>
                <button class="btn-primary" onclick="openBooking(${movie.id})">Book Now</button>
            </div>
        `;
        slider.appendChild(slide);
    });

    document.getElementById('next-btn').addEventListener('click', () => changeSlide(1));
    document.getElementById('prev-btn').addEventListener('click', () => changeSlide(-1));
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');

    currentSlide = (currentSlide + direction + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
}

function renderMovies(filteredMovies = movies) {
    if (!movieGrid) return;

    const countEl = document.getElementById('movie-result-count');
    if (countEl) {
        countEl.textContent = filteredMovies.length === movies.length
            ? ''
            : `${filteredMovies.length} result${filteredMovies.length !== 1 ? 's' : ''} found`;
    }

    movieGrid.style.opacity = '0';
    movieGrid.style.transform = 'translateY(10px)';
    movieGrid.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

    setTimeout(() => {
        movieGrid.innerHTML = '';

        if (filteredMovies.length === 0) {
            movieGrid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:4rem 2rem;color:var(--text-dim)">
                    <div style="font-size:3rem;margin-bottom:1rem">🎬</div>
                    <h3 style="color:var(--text-main);margin-bottom:0.5rem">No movies found</h3>
                    <p>Try a different genre or search term.</p>
                </div>`;
        } else {
            filteredMovies.forEach(movie => {
                const card = document.createElement('div');
                card.className = 'movie-card reveal';
                card.innerHTML = `
                    <div class="card-img-container">
                        <img src="${movie.image}" alt="${movie.title}" loading="lazy">
                        <div class="card-overlay">
                            <div class="card-info">
                                <div class="card-genre-badge">${movie.genre}</div>
                                <h3>${movie.title}</h3>
                                <p>⭐ ${movie.rating} &nbsp;•&nbsp; ${movie.duration} &nbsp;•&nbsp; ₹${movie.price}</p>
                                <button class="btn-book-card">Book Now</button>
                            </div>
                        </div>
                    </div>
                `;
                card.onclick = () => openBooking(movie.id);
                movieGrid.appendChild(card);
                if (typeof observer !== 'undefined') observer.observe(card);
            });
        }

        movieGrid.style.opacity = '1';
        movieGrid.style.transform = 'translateY(0)';
        if (window.lucide) lucide.createIcons();
    }, 200);
}

window.recommendMood = function(mood) {
    let filtered = [];
    
    filtered = movies.filter(m => {
        if (m.mood === mood) return true;
        
        if (mood === 'Thrilling') {
            return m.genre === 'Action' || m.genre === 'Sci-Fi' || m.title.includes('Dark') || m.title.includes('Joker');
        } else if (mood === 'Relaxed') {
            return m.genre === 'Drama' || m.genre === 'Comedy';
        } else if (mood === 'Mind-Bending') {
            return m.genre === 'Sci-Fi' || m.title.includes('Inception') || m.title.includes('Interstellar');
        } else if (mood === 'Dramatic') {
            return m.genre === 'Drama' || m.title.includes('Oppenheimer');
        }
        return false;
    });

    const wrapper = document.getElementById('mood-recommendations-wrapper');
    const moodGrid = document.getElementById('mood-movie-grid');
    const moodTitle = document.getElementById('mood-title');
    
    if (wrapper && moodGrid && moodTitle) {
        wrapper.style.display = 'block';
        moodTitle.innerText = `Recommended for a ${mood} mood:`;
        
        moodGrid.innerHTML = '';
        if (filtered.length === 0) {
            moodGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: var(--text-dim);'>No movies match this mood right now!</p>";
        } else {
            filtered.forEach(movie => {
                const card = document.createElement('div');
                card.className = 'movie-card reveal active';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.innerHTML = `
                    <div class="card-img-container">
                        <img src="${movie.image}" alt="${movie.title}" loading="lazy">
                        <div class="card-overlay">
                            <div class="card-info">
                                <div class="card-genre-badge">${movie.genre}</div>
                                <h3>${movie.title}</h3>
                                <p>⭐ ${movie.rating} &nbsp;•&nbsp; ${movie.duration} &nbsp;•&nbsp; ₹${movie.price}</p>
                                <button class="btn-book-card">Book Now</button>
                            </div>
                        </div>
                    </div>
                `;
                card.onclick = () => openBooking(movie.id);
                moodGrid.appendChild(card);
            });
            if (window.lucide) lucide.createIcons();
        }
        
        setTimeout(() => {
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}

function renderTheaters() {
    if (!theaterGrid) return;
    theaterGrid.innerHTML = '';
    theaters.forEach(theater => {
        const card = document.createElement('div');
        card.className = 'theater-card reveal';
        card.innerHTML = `
            <div class="theater-img-wrap">
                <img src="${theater.image}" alt="${theater.name}" class="theater-img" loading="lazy">
                <div class="theater-img-overlay"></div>
                <div class="theater-rating-badge">
                    <i data-lucide="star"></i> ${theater.rating}
                </div>
            </div>
            <div class="theater-info">
                <h3>${theater.name}</h3>
                <p class="theater-location"><i data-lucide="map-pin"></i> ${theater.location}</p>
                <div class="theater-tags">
                    ${theater.features.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="theater-showtimes-preview">
                    <i data-lucide="clock"></i>
                    <span>${theater.showtimes.slice(0, 3).join(' · ')}${theater.showtimes.length > 3 ? ' …' : ''}</span>
                </div>
                <button class="btn-primary theater-book-btn" onclick="event.stopPropagation(); openTheaterBooking(${theater.id})">
                    <i data-lucide="ticket"></i> Book Tickets
                </button>
            </div>
        `;
        theaterGrid.appendChild(card);
        if (typeof observer !== 'undefined') observer.observe(card);
    });
    if (window.lucide) lucide.createIcons();
}

function openTheaterBooking(theaterId) {
    const theater = theaters.find(t => t.id === theaterId);
    if (!theater) return;

    const modal = document.getElementById('theater-picker-modal');
    const titleEl = document.getElementById('tpicker-theater-name');
    const moviesEl = document.getElementById('tpicker-movies');
    const timesEl = document.getElementById('tpicker-times');
    const confirmBtn = document.getElementById('tpicker-confirm');

    if (!modal) return;

    if (titleEl) titleEl.textContent = theater.name;

    let pickedMovieId = null;
    let pickedTime = null;

    if (moviesEl) {
        moviesEl.innerHTML = movies.map(m => `
            <div class="tpicker-movie-item" data-id="${m.id}" onclick="tpickerSelectMovie(${m.id}, ${theaterId})">
                <img src="${m.image}" alt="${m.title}" loading="lazy">
                <div class="tpicker-movie-info">
                    <span class="tpicker-genre">${m.genre}</span>
                    <strong>${m.title}</strong>
                    <span class="tpicker-price">₹${m.price} / seat</span>
                </div>
                <div class="tpicker-check"><i data-lucide="check-circle-2"></i></div>
            </div>
        `).join('');
    }

    if (timesEl) {
        timesEl.innerHTML = theater.showtimes.map(t => `
            <div class="tpicker-time-slot" data-time="${t}" onclick="tpickerSelectTime('${t}')">
                ${t}
            </div>
        `).join('');
    }

    if (window.lucide) lucide.createIcons();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function tpickerSelectMovie(movieId, theaterId) {
    document.querySelectorAll('.tpicker-movie-item').forEach(el => el.classList.remove('selected'));
    const el = document.querySelector(`.tpicker-movie-item[data-id="${movieId}"]`);
    if (el) el.classList.add('selected');
    window._tpickerMovieId = movieId;
    checkTpickerReady(theaterId);
}

function tpickerSelectTime(time) {
    document.querySelectorAll('.tpicker-time-slot').forEach(el => el.classList.remove('selected'));
    const el = document.querySelector(`.tpicker-time-slot[data-time="${time}"]`);
    if (el) el.classList.add('selected');
    window._tpickerTime = time;
    const theaterId = window._tpickerTheaterId;
    checkTpickerReady(theaterId);
}

function checkTpickerReady(theaterId) {
    window._tpickerTheaterId = theaterId;
    const confirmBtn = document.getElementById('tpicker-confirm');
    if (confirmBtn) {
        confirmBtn.disabled = !(window._tpickerMovieId && window._tpickerTime);
    }
}

function confirmTheaterBooking() {
    const theaterId = window._tpickerTheaterId;
    const movieId = window._tpickerMovieId;
    const time = window._tpickerTime;

    if (!theaterId || !movieId || !time) {
        alert('Please select a movie and a showtime.');
        return;
    }

    const theater = theaters.find(t => t.id === theaterId);
    document.getElementById('theater-picker-modal')?.classList.remove('active');

    currentBookingInfo.theater = theater.name;
    currentBookingInfo.time = time;

    openBooking(movieId);
    setTimeout(() => {
        selectShowtime(theater.name, time);
    }, 100);

    window._tpickerMovieId = null;
    window._tpickerTime = null;
    window._tpickerTheaterId = null;
}

function selectPayment(element) {
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');

    const method = element.querySelector('span').innerText.toLowerCase();
    document.querySelectorAll('.payment-form').forEach(form => form.classList.remove('active'));

    if (method.includes('upi')) document.getElementById('upi-form').classList.add('active');
    else if (method.includes('card')) document.getElementById('card-form').classList.add('active');
    else if (method.includes('banking')) document.getElementById('banking-form').classList.add('active');
    else if (method.includes('cash')) document.getElementById('cash-form').classList.add('active');
    
    updateSummary(); // Re-calculate if cash surcharge applies
}

function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.movie-card, .theater-card, .section-header, .page-header, .mood-card').forEach(el => {
        if (!el.classList.contains('movie-card') && !el.classList.contains('mood-card')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'var(--transition)';
        }
        observer.observe(el);
    });
}

function openBooking(movieId) {
    currentMovie = movies.find(m => m.id === movieId);
    if (!currentMovie) return;

    // Store movieId for ticket generation fallback in case currentMovie becomes null
    localStorage.setItem('cineflow_current_booking_movieid', movieId);

    const pTitle = getEl('preview-movie-title');
    const pRating = getEl('preview-movie-rating');
    const pGenre = getEl('preview-movie-genre');
    const pDuration = getEl('preview-movie-duration');
    const pDesc = getEl('preview-movie-desc');
    const pDirector = getEl('preview-movie-director');
    const pCast = getEl('preview-movie-cast');
    const pBg = getEl('preview-movie-bg');

    if (pBg) {
        pBg.crossOrigin = "anonymous";
        pBg.src = currentMovie.image;
    }
    if (pTitle) pTitle.innerText = currentMovie.title;
    if (pRating) pRating.innerHTML = `<i data-lucide="star"></i> ${currentMovie.rating}`;
    if (pGenre) pGenre.innerText = currentMovie.genre;
    if (pDuration) pDuration.innerHTML = `<i data-lucide="clock"></i> ${currentMovie.duration}`;
    if (pDesc) pDesc.innerText = currentMovie.description;
    if (pDirector) pDirector.innerText = currentMovie.director;

    const pTrailer = getEl('preview-movie-trailer');
    if (pTrailer) {
        const trailerSrc = normalizeTrailerUrl(currentMovie.trailer);
        if (trailerSrc) {
            pTrailer.src = trailerSrc;
            pTrailer.setAttribute('title', `${currentMovie.title} Trailer`);
        } else {
            pTrailer.src = '';
            pTrailer.setAttribute('title', 'No trailer available');
        }
    }

    if (pCast) {
        pCast.innerHTML = '';
        currentMovie.cast.forEach(member => {
            const item = document.createElement('div');
            item.className = 'cast-item';
            item.innerHTML = `<span>${member}</span>`;
            pCast.appendChild(item);
        });
    }

    const mTitle = getEl('modal-movie-title');
    const mDesc = getEl('modal-movie-desc');
    if (mTitle) mTitle.innerText = currentMovie.title;
    if (mDesc) mDesc.innerText = currentMovie.genre + ' • ' + currentMovie.duration;

    selectedSeats = [];
    addonTotal = 0;
    selectedAddons = [];
    selectedParking = null;
    document.querySelectorAll('.addon-card, .parking-card').forEach(card => card.classList.remove('active'));

    updateSummary();
    switchStep('step-details');
    renderDateSelector();
    renderTheaterSlots();

    const pm = getEl('payment-modal');
    if (pm) {
        const modalContent = pm.querySelector('.modal-content');
        if (modalContent) modalContent.style.maxWidth = '500px';

        pm.querySelectorAll('.checkout-header, .payment-details-container, .checkout-footer, .close-modal').forEach(el => {
            el.style.display = '';
        });
        const successView = getEl('payment-success');
        if (successView) successView.classList.remove('active');
    }

    const m = getEl('booking-modal');
    if (m) {
        m.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        console.error('Booking modal not found!');
    }
}

function switchStep(stepId) {
    document.querySelectorAll('.booking-view').forEach(view => {
        view.classList.remove('active');
    });
    const nextView = getEl(stepId);
    if (nextView) nextView.classList.add('active');

    if (window.lucide) lucide.createIcons();
}

function renderDateSelector() {
    const datePicker = document.getElementById('date-picker');
    if (!datePicker) return;

    datePicker.innerHTML = '';
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(today.getDate() + i);

        const dateItem = document.createElement('div');
        dateItem.className = `date-item ${i === 0 ? 'active' : ''}`;
        dateItem.innerHTML = `
            <span class="day">${days[d.getDay()]}</span>
            <span class="date">${d.getDate()}</span>
            <span class="day">${months[d.getMonth()]}</span>
        `;
        dateItem.onclick = () => {
            document.querySelectorAll('.date-item').forEach(item => item.classList.remove('active'));
            dateItem.classList.add('active');
            currentBookingInfo.date = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        };
        if (i === 0) currentBookingInfo.date = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        datePicker.appendChild(dateItem);
    }
}

function renderTheaterSlots(sortByDistance = false) {
    const list = document.getElementById('theater-list');
    if (!list) return;

    list.innerHTML = '';

    const locatorHeader = document.createElement('div');
    locatorHeader.className = 'location-tracker-header';
    locatorHeader.innerHTML = `
        <div class="lt-info">
            <i data-lucide="crosshair"></i>
            <div>
                <h4>Find Nearby Theatres</h4>
                <p id="lt-status">Allow location access to find the closest shows</p>
            </div>
        </div>
        <button class="btn-primary" id="btn-locate-me" style="font-size: 0.8rem; padding: 0.5rem 1rem;">
            <i data-lucide="map-pin" style="width: 14px;"></i> Locate Me
        </button>
    `;
    list.appendChild(locatorHeader);

    if (!document.getElementById('lt-style')) {
        const style = document.createElement('style');
        style.id = 'lt-style';
        style.textContent = `
            .location-tracker-header {
                display: flex; justify-content: space-between; align-items: center;
                background: rgba(0, 242, 255, 0.05); border: 1px solid rgba(0, 242, 255, 0.2);
                padding: 1rem 1.5rem; border-radius: 12px; margin-bottom: 2rem;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            .lt-info { display: flex; align-items: center; gap: 1rem; }
            .lt-info i { color: var(--primary); width: 24px; height: 24px; }
            .lt-info h4 { margin: 0 0 0.2rem; font-size: 1.1rem; color: #fff; }
            .lt-info p { margin: 0; font-size: 0.85rem; color: var(--text-dim); }
            .theater-distance { font-size: 0.8rem; padding: 2px 8px; border-radius: 12px; background: rgba(124, 58, 237, 0.2); color: #b78aff; font-weight: 700; margin-left: 10px; border: 1px solid rgba(124, 58, 237, 0.3); }
        `;
        document.head.appendChild(style);
    }

    let displayTheaters = [...theaters];
    displayTheaters.forEach((t, i) => {
        t.lat = t.lat || (19.0760 + parseFloat('0.0' + (i*2)));
        t.lon = t.lon || (72.8777 - parseFloat('0.0' + (i*3)));
        if (!sortByDistance) t.distanceLabel = null;
    });

    if (sortByDistance) {
        displayTheaters.sort((a, b) => (a.distanceVal || 0) - (b.distanceVal || 0));
    }

    displayTheaters.forEach(theater => {
        const row = document.createElement('div');
        row.className = 'theater-row';
        row.innerHTML = `
            <div class="theater-header-small">
                <div class="theater-name-small" style="display:flex; align-items:center;">
                    <i data-lucide="heart"></i>
                    ${theater.name}
                    ${theater.distanceLabel ? `<span class="theater-distance">📍 ${theater.distanceLabel}</span>` : ''}
                </div>
                <div style="font-size: 0.8rem; color: var(--text-dim); cursor: pointer;">
                    <i data-lucide="info" style="width: 14px;"></i> INFO
                </div>
            </div>
            <p class="cancellation-tag">Cancellation Available</p>
            <div class="showtimes-grid">
                ${theater.showtimes.map((time, idx) => `
                    <div class="time-slot ${idx % 2 === 0 ? '' : 'orange'}" onclick="selectShowtime('${theater.name}', '${time}')">
                        ${time}
                        <span>ENG</span>
                    </div>
                `).join('')}
            </div>
        `;
        list.appendChild(row);
    });

    const locateBtn = document.getElementById('btn-locate-me');
    const statusText = document.getElementById('lt-status');
    if (locateBtn && statusText) {
        locateBtn.onclick = () => {
            locateBtn.innerHTML = `<i data-lucide="loader" class="spin" style="width: 14px; animation: spin 1s linear infinite;"></i> Tracking...`;
            statusText.textContent = "Acquiring GPS Signal...";
            
            if (!document.getElementById('spin-style')) {
                const sstyle = document.createElement('style');
                sstyle.id = 'spin-style';
                sstyle.textContent = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
                document.head.appendChild(sstyle);
            }

            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        statusText.textContent = "Location found! Showing closest theatres.";
                        statusText.style.color = "var(--primary)";
                        
                        displayTheaters.forEach((t, i) => {
                            const mockDist = (1.2 + (Math.random() * 8.5)).toFixed(1);
                            t.distanceVal = parseFloat(mockDist);
                            t.distanceLabel = `${mockDist} km away`;
                        });
                        
                        setTimeout(() => renderTheaterSlots(true), 1000);
                    },
                    (error) => {
                        statusText.textContent = "GPS Access Denied. Using network approximation.";
                        statusText.style.color = "#ff4d4d";
                        
                        displayTheaters.forEach((t, i) => {
                            const mockDist = (2.5 + (Math.random() * 12.0)).toFixed(1);
                            t.distanceVal = parseFloat(mockDist);
                            t.distanceLabel = `~${mockDist} km away`;
                        });
                        
                        setTimeout(() => renderTheaterSlots(true), 1500);
                    },
                    { enableHighAccuracy: true, timeout: 5000 }
                );
            } else {
                statusText.textContent = "Geolocation not supported.";
            }
        };
    }

    if (window.lucide) lucide.createIcons();
}

function selectShowtime(theaterName, time) {
    currentBookingInfo.theater = theaterName;
    currentBookingInfo.time = time;
    document.getElementById('selected-theater-time').innerText = `${theaterName} • ${time}`;

    switchStep('step-seats');
    updateSummary();
    initSeatMap();
}

function initSeatMap() {
    const container = document.getElementById('seat-sections-container');
    if (!container) return;
    container.innerHTML = '';
    selectedSeats = []; // Reset selected seats when map is re-initialized

    function makeRow(leftEl, rightEl) {
        const row = document.createElement('div');
        row.className = 'seat-row-block';
        row.appendChild(leftEl);
        row.appendChild(rightEl);
        return row;
    }

    function makeGrid(cols = 8) {
        const g = document.createElement('div');
        g.className = 'seat-grid-sub';
        g.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        return g;
    }

    const standardRows = [
        ['A', 'B'],
        ['C', 'D'],
        ['E', 'F'],
        ['G', 'H'],
        ['I', 'J']
    ];

    standardRows.forEach(([leftRow, rightRow]) => {
        const section = document.createElement('div');
        section.className = 'seat-sections-block';

        const leftBlock = document.createElement('div');
        leftBlock.style.cssText = 'display:flex;flex-direction:column;gap:10px';
        const leftGrid = makeGrid(8);
        for (let i = 1; i <= 8; i++) createSeat(leftGrid, leftRow, i);
        leftBlock.appendChild(leftGrid);

        const rightBlock = document.createElement('div');
        rightBlock.style.cssText = 'display:flex;flex-direction:column;gap:10px';
        const rightGrid = makeGrid(8);
        for (let i = 1; i <= 8; i++) createSeat(rightGrid, rightRow, i);
        rightBlock.appendChild(rightGrid);

        section.appendChild(makeRow(leftBlock, rightBlock));
        container.appendChild(section);
    });

    const premiumSection = document.createElement('div');
    premiumSection.className = 'seat-sections-block premium-section';

    const pLeftGrid = makeGrid(8);
    for (let i = 1; i <= 8; i++) createSeat(pLeftGrid, 'P', i, 'premium');

    const pRightGrid = makeGrid(8);
    for (let i = 9; i <= 16; i++) createSeat(pRightGrid, 'P', i, 'premium');

    premiumSection.appendChild(makeRow(pLeftGrid, pRightGrid));
    container.appendChild(premiumSection);

    const coupleSection = document.createElement('div');
    coupleSection.className = 'seat-sections-block couple-section';

    const kLeftGrid = makeGrid(4);
    for (let i = 1; i <= 4; i++) createSeat(kLeftGrid, 'K', i, 'couple');

    const kRightGrid = makeGrid(4);
    for (let i = 5; i <= 8; i++) createSeat(kRightGrid, 'K', i, 'couple');

    coupleSection.appendChild(makeRow(kLeftGrid, kRightGrid));
    container.appendChild(coupleSection);
}

function triggerSmartSelect() {
    const input = document.getElementById('smart-seat-count');
    const count = parseInt(input.value);
    if (isNaN(count) || count <= 0) {
        alert("Please enter a valid number of seats.");
        return;
    }
    if (count > 9) {
        alert("Maximum 9 seats allowed for smart selection.");
        input.value = 9;
        return;
    }

    selectedSeats = [];
    document.querySelectorAll('.seat.selected').forEach(s => {
        s.classList.remove('selected');
        s.classList.add('available');
    });

    const allAvailable = Array.from(document.querySelectorAll('.seat.available'));
    if (allAvailable.length < count) {
        alert(`Sorry, only ${allAvailable.length} seats are available.`);
        return;
    }

    const rowWeights = {
        'P': 1, 'A': 2, 'B': 2, 'C': 1, 'D': 1, 'E': 0, 'F': 0, 'G': 1, 'H': 1, 'I': 2, 'J': 2, 'K': 3
    };
    const rows = ['P', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    let bestSelection = null;

    for (const rowLabel of rows) {
        const rowSeats = allAvailable.filter(s => s.innerText.startsWith(rowLabel))
            .sort((a, b) => {
                const nA = parseInt(a.innerText.slice(1));
                const nB = parseInt(b.innerText.slice(1));
                return nA - nB;
            });

        if (rowSeats.length < count) continue;

        for (let i = 0; i <= rowSeats.length - count; i++) {
            const block = rowSeats.slice(i, i + count);

            let isContiguous = true;
            for (let j = 0; j < block.length - 1; j++) {
                const curr = parseInt(block[j].innerText.slice(1));
                const next = parseInt(block[j + 1].innerText.slice(1));
                if (next !== curr + 1) {
                    isContiguous = false;
                    break;
                }
            }

            if (isContiguous) {
                const avgCol = block.reduce((sum, s) => sum + parseInt(s.innerText.slice(1)), 0) / count;
                const colScore = Math.abs(avgCol - 5);
                const score = rowWeights[rowLabel] * 10 + colScore;

                if (!bestSelection || score < bestSelection.score) {
                    bestSelection = { seats: block, score: score };
                }
            }
        }
    }

    const seatsToSelect = bestSelection ? bestSelection.seats :
        allAvailable.sort((a, b) => {
            const rA = a.innerText.charAt(0);
            const rB = b.innerText.charAt(0);
            const nA = parseInt(a.innerText.slice(1));
            const nB = parseInt(b.innerText.slice(1));
            const sA = rowWeights[rA] * 10 + Math.abs(nA - 5);
            const sB = rowWeights[rB] * 10 + Math.abs(nB - 5);
            return sA - sB;
        }).slice(0, count);

    seatsToSelect.forEach(s => {
        s.classList.add('selected');
        s.classList.remove('available');
        selectedSeats.push(s.innerText);
    });

    updateSummary();
    if (window.lucide) lucide.createIcons();
}

function createSeat(parent, row, num, type = 'standard') {
    const seatId = `${row}${num}`;
    const seat = document.createElement('div');
    seat.className = `seat available ${type}`;
    seat.innerText = seatId;
    seat.dataset.seatId = seatId;
    seat.dataset.type = type;
    seat.dataset.row = row;
    seat.dataset.col = num;

    if (Math.random() < 0.15) seat.className = `seat occupied ${type}`;

    seat.onclick = () => {
        if (!seat.classList.contains('occupied')) {
            seat.classList.toggle('selected');
            if (seat.classList.contains('selected')) {
                selectedSeats.push(seatId);
            } else {
                selectedSeats = selectedSeats.filter(s => s !== seatId);
            }
            updateSummary();
            updateSeatViewBtn(seatId, row, num, type, seat.classList.contains('selected'));
        }
    };
    parent.appendChild(seat);
}

function updateSeatViewBtn(seatId, row, col, type, isSelected) {
    let btn = document.getElementById('seat-view-preview-btn');

    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'seat-view-preview-btn';
        btn.className = 'seat-view-float-btn';
        btn.innerHTML = `<span class="svp-icon">👁</span> <span class="svp-label">View from Seat</span> <span class="svp-seat-badge" id="svp-seat-badge"></span>`;
        const controls = document.querySelector('.smart-selection-controls');
        if (controls) controls.after(btn);
    }

    if (isSelected && selectedSeats.length > 0) {
        const lastSeat = selectedSeats[selectedSeats.length - 1];
        document.getElementById('svp-seat-badge').textContent = lastSeat;
        btn.style.display = 'flex';
        btn.onclick = () => showSeatViewPreview(lastSeat);
    } else if (selectedSeats.length > 0) {
        const lastSeat = selectedSeats[selectedSeats.length - 1];
        document.getElementById('svp-seat-badge').textContent = lastSeat;
        btn.onclick = () => showSeatViewPreview(lastSeat);
    } else {
        btn.style.display = 'none';
    }
}

function showSeatViewPreview(seatId) {
    injectSeatViewStyles();

    const row    = seatId.charAt(0);
    const colNum = parseInt(seatId.slice(1));

    const rowOrder = { K:0, P:1, A:2, B:3, C:4, D:5, E:6, F:7, G:8, H:9, I:10, J:11 };
    const totalRows = 12;
    const rowDist  = (rowOrder[row] ?? 6) / totalRows;          // 0=front, 1=back

    const totalCols = (row === 'K') ? 8 : (row === 'P') ? 16 : 16;
    const centreCol = (totalCols + 1) / 2;
    const colOffset = (colNum - centreCol) / centreCol;          // -1=far left, +1=far right

    const perspectivePx = 600 + rowDist * 800;                  // more depth = further back
    const rotateX       = 8 + rowDist * 22;                     // tilt screen up more when far
    const skewY         = colOffset * 10;                        // horizontal skew for side seats
    const screenScale   = 1 - rowDist * 0.45;                   // screen appears smaller far away
    const screenLeft    = 50 + colOffset * 20;                  // screen shifts horizontally
    const brightness    = Math.max(0.4, 1 - rowDist * 0.45);

    const seatTypeName = row === 'P' ? '⭐ Premium'
                       : row === 'K' ? '💑 Couple Lounge'
                       : '🪑 Standard';
    const viewQuality  = rowDist < 0.25 ? { label: 'FRONT ROW', color: '#ff5a70' }
                       : rowDist < 0.5  ? { label: 'BEST VIEW', color: '#00f2ff' }
                       : rowDist < 0.75 ? { label: 'GOOD VIEW', color: '#7c3aed' }
                       :                  { label: 'BACK ROW',  color: '#999' };

    document.getElementById('seat-view-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'seat-view-modal';
    modal.className = 'svp-modal';
    modal.innerHTML = `
        <div class="svp-backdrop" onclick="document.getElementById('seat-view-modal').remove()"></div>
        <div class="svp-panel">
            <div class="svp-header">
                <div class="svp-header-left">
                    <span class="svp-type-badge">${seatTypeName}</span>
                    <h3 class="svp-title">Seat <span>${seatId}</span> — View Preview</h3>
                    <span class="svp-quality-badge" style="color:${viewQuality.color};border-color:${viewQuality.color}">${viewQuality.label}</span>
                </div>
                <button class="svp-close" onclick="document.getElementById('seat-view-modal').remove()">✕</button>
            </div>

            <div class="svp-theater" style="perspective: ${perspectivePx}px;">
                <div class="svp-room">
                    <!-- Ceiling lights -->
                    <div class="svp-ceiling">
                        ${Array.from({length:8}, (_,i) => `<div class="svp-ceiling-light" style="animation-delay:${i*0.15}s"></div>`).join('')}
                    </div>

                    <!-- Side walls and exit signs -->
                    <div class="svp-wall-lights left">
                        ${Array.from({length:4}, (_,i) => `<div class="svp-wall-light" style="top:${15+i*20}%"></div>`).join('')}
                    </div>
                    <div class="svp-wall-lights right">
                        ${Array.from({length:4}, (_,i) => `<div class="svp-wall-light" style="top:${15+i*20}%"></div>`).join('')}
                    </div>
                    <div class="svp-exit-sign left">EXIT</div>
                    <div class="svp-exit-sign right">EXIT</div>

                    <!-- Screen -->
                    <div class="svp-screen-wrap" style="
                        transform: rotateX(${rotateX}deg) skewY(${skewY}deg) scale(${screenScale});
                        left: ${screenLeft}%;
                        filter: brightness(${brightness});
                    ">
                        <div class="svp-screen-glow" style="background: radial-gradient(ellipse, rgba(120,130,255,0.3), transparent 70%);"></div>
                        <div class="svp-screen">
                            <div class="svp-film-content" style="background-image: url('${currentMovie ? currentMovie.image : ''}'); background-size: cover; background-position: center; box-shadow: inset 0 0 50px rgba(0,0,0,0.8);">
                                <div class="svp-film-bars"></div>
                                <div class="svp-film-scene">
                                    <div class="svp-scene-text" style="display:none;">🎬</div>
                                    <div class="svp-scene-title" style="display:none;">${currentMovie ? currentMovie.title : 'Now Playing'}</div>
                                </div>
                            </div>
                        </div>
                        <div class="svp-screen-label">S C R E E N</div>
                    </div>

                    <!-- Floor perspective lines -->
                    <div class="svp-floor">
                        ${Array.from({length:8}, (_,i) => `<div class="svp-floor-line" style="opacity:${0.08+(i*0.04)}; box-shadow: 0 0 10px rgba(0,242,255,0.1)"></div>`).join('')}
                    </div>

                    <!-- Seat rows in front (silhouettes) -->
                    <div class="svp-audience">
                        ${Array.from({length: Math.max(1, Math.round(rowDist * 6))}, (_,r) => `
                            <div class="svp-audience-row" style="opacity:${0.4 + r*0.1}; transform: translateZ(${r * 40}px) translateY(${r * 2}px);">
                                ${Array.from({length:11}, () => `<div class="svp-head" style="transform: scale(${0.85 + Math.random() * 0.3}) translateX(${(Math.random()-0.5)*10}px);"></div>`).join('')}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="svp-info-bar">
                <div class="svp-info-item">
                    <span class="svp-info-label">Seat</span>
                    <span class="svp-info-val">${seatId}</span>
                </div>
                <div class="svp-info-item">
                    <span class="svp-info-label">Row Distance</span>
                    <span class="svp-info-val">${Math.round(rowDist * 100)}% from screen</span>
                </div>
                <div class="svp-info-item">
                    <span class="svp-info-label">Side Angle</span>
                    <span class="svp-info-val">${colOffset > 0 ? `${Math.round(colOffset*100)}% Right` : colOffset < 0 ? `${Math.round(Math.abs(colOffset)*100)}% Left` : 'Centre'}</span>
                </div>
                <div class="svp-info-item">
                    <span class="svp-info-label">View Rating</span>
                    <span class="svp-info-val" style="color:${viewQuality.color}">${viewQuality.label}</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('svp-open'));
}

function injectSeatViewStyles() {
    if (document.getElementById('svp-style')) return;
    const style = document.createElement('style');
    style.id = 'svp-style';
    style.textContent = `
    /* Float button */
    .seat-view-float-btn {
        display: flex; align-items: center; gap: 8px;
        margin: 12px 0 4px; padding: 8px 16px;
        background: linear-gradient(135deg, rgba(0,242,255,0.1), rgba(124,58,237,0.1));
        border: 1px solid rgba(0,242,255,0.35); border-radius: 50px;
        color: #fff; font-family: 'Outfit',sans-serif; font-size: 0.85rem; font-weight: 600;
        cursor: pointer; transition: all 0.25s ease;
        animation: svpBtnPulse 2s ease infinite;
    }
    .seat-view-float-btn:hover {
        background: linear-gradient(135deg, rgba(0,242,255,0.2), rgba(124,58,237,0.2));
        box-shadow: 0 0 20px rgba(0,242,255,0.25);
        transform: translateY(-1px);
    }
    .svp-icon { font-size: 1rem; }
    .svp-seat-badge {
        background: linear-gradient(135deg, var(--primary,#00f2ff), #7c3aed);
        color: #000; font-size: 0.7rem; font-weight:900;
        padding: 2px 8px; border-radius: 20px;
    }
    @keyframes svpBtnPulse {
        0%,100% { box-shadow: 0 0 0 0 rgba(0,242,255,0.2); }
        50%      { box-shadow: 0 0 15px 4px rgba(0,242,255,0.15); }
    }

    /* Modal overlay */
    .svp-modal { position:fixed; inset:0; z-index:99990; display:flex; align-items:center; justify-content:center; }
    .svp-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); }
    .svp-panel {
        position:relative; width:min(760px,95vw); max-height:90vh; overflow:hidden;
        background:rgba(8,8,12,0.98); border:1px solid rgba(0,242,255,0.2); border-radius:24px;
        box-shadow:0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,242,255,0.05);
        opacity:0; transform:scale(0.92) translateY(20px);
        transition:opacity 0.3s ease, transform 0.3s cubic-bezier(0.23,1,0.32,1);
    }
    .svp-modal.svp-open .svp-panel { opacity:1; transform:scale(1) translateY(0); }

    /* Header */
    .svp-header {
        display:flex; align-items:center; justify-content:space-between;
        padding:1rem 1.4rem; border-bottom:1px solid rgba(255,255,255,0.06);
    }
    .svp-header-left { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
    .svp-title { font-size:1rem; font-weight:700; color:#fff; margin:0; }
    .svp-title span { color:var(--primary,#00f2ff); }
    .svp-type-badge {
        font-size:0.7rem; font-weight:700; letter-spacing:1px; padding:3px 10px;
        background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
        border-radius:20px; color:rgba(255,255,255,0.6);
    }
    .svp-quality-badge {
        font-size:0.65rem; font-weight:800; letter-spacing:1.5px;
        padding:3px 10px; border:1px solid; border-radius:20px;
    }
    .svp-close {
        background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
        border-radius:50%; width:30px; height:30px; color:#fff; cursor:pointer;
        font-size:0.9rem; display:flex; align-items:center; justify-content:center;
        transition:background 0.2s;
    }
    .svp-close:hover { background:rgba(255,90,112,0.2); border-color:#ff5a70; }

    /* Theater viewport */
    .svp-theater {
        position:relative; height:360px; overflow:hidden;
        background:radial-gradient(ellipse 90% 80% at 50% -10%, #0d0d18, #000000 80%);
        border-bottom:1px solid rgba(255,255,255,0.04);
        box-shadow: inset 0 0 100px rgba(0,0,0,0.9);
    }
    .svp-room { position:relative; width:100%; height:100%; transform-style:preserve-3d; }

    /* Side Walls & Exit Signs */
    .svp-wall-lights { position:absolute; top:0; bottom:0; width:40px; display:flex; flex-direction:column; align-items:center; }
    .svp-wall-lights.left { left:0; perspective-origin: right center; }
    .svp-wall-lights.right { right:0; perspective-origin: left center; }
    .svp-wall-light {
        position:absolute; width:4px; height:12px; background:#fff; border-radius:2px;
        box-shadow: 0 0 15px 5px rgba(0, 242, 255, 0.3); opacity: 0.6;
    }
    .svp-exit-sign {
        position:absolute; bottom:30%; font-size:0.5rem; color:#ff3b3b; font-weight:900;
        letter-spacing:1px; border:1px solid #ff3b3b; padding:1px 4px; border-radius:2px;
        box-shadow: 0 0 10px rgba(255,59,59,0.4), inset 0 0 5px rgba(255,59,59,0.4);
        text-shadow: 0 0 5px #ff3b3b; opacity:0.8;
    }
    .svp-exit-sign.left { left:10px; transform: rotateY(45deg); }
    .svp-exit-sign.right { right:10px; transform: rotateY(-45deg); }

    /* Ceiling */
    .svp-ceiling {
        position:absolute; top:0; left:0; right:0; height:40px;
        display:flex; justify-content:space-around; align-items:flex-start; padding-top:6px;
    }
    .svp-ceiling-light {
        width:4px; height:16px; border-radius:2px;
        background:linear-gradient(to bottom, #dceaff, transparent);
        box-shadow:0 0 15px 5px rgba(220, 234, 255, 0.15);
        animation:ceilFlicker 5s ease infinite alternate;
    }
    @keyframes ceilFlicker {
        0%,90%,100%{opacity:1} 92%{opacity:0.4} 95%{opacity:0.9} 96%{opacity:0.5} 98%{opacity:1}
    }

    /* Screen */
    .svp-screen-wrap {
        position:absolute; top:15%; left:50%; width:75%; height:55%;
        transform-origin:top center;
        transform: translateX(-50%);
        transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .svp-screen-glow {
        position:absolute; inset:-40px;
        pointer-events:none;
        filter: blur(20px);
        mix-blend-mode: screen;
        animation: glowPulse 4s infinite alternate;
    }
    @keyframes glowPulse { from { opacity: 0.8; } to { opacity: 1; } }
    .svp-screen {
        width:100%; height:100%; border-radius:6px; overflow:hidden;
        border:2px solid rgba(255,255,255,0.1);
        box-shadow:0 0 60px rgba(100,200,255,0.4), inset 0 0 40px rgba(0,0,0,0.8);
        background:#000;
        position:relative;
    }
    .svp-screen::after { /* Vignette effect on screen */
        content:''; position:absolute; inset:0;
        box-shadow: inset 0 0 50px rgba(0,0,0,0.9);
        pointer-events:none;
    }
    .svp-film-content {
        width:100%; height:100%; position:relative;
        overflow:hidden;
        background-color: #050510;
    }
    .svp-film-bars {
        position:absolute; inset:0;
        background:repeating-linear-gradient(
            0deg, transparent, transparent 30px,
            rgba(255,255,255,0.02) 30px, rgba(255,255,255,0.02) 31px
        );
        animation:filmScroll 8s linear infinite;
        mix-blend-mode: overlay;
    }
    @keyframes filmScroll { from{background-position:0 0} to{background-position:0 -600px} }
    .svp-film-scene {
        position:absolute; inset:0; display:flex; flex-direction:column;
        align-items:center; justify-content:center; gap:6px;
    }
    .svp-scene-text { font-size:2rem; opacity:0.7; }
    .svp-scene-title {
        font-size:0.7rem; font-weight:700; letter-spacing:2px; text-transform:uppercase;
        color:rgba(255,255,255,0.5); text-align:center;
    }
    .svp-screen-label {
        text-align:center; font-size:0.55rem; letter-spacing:6px; color:rgba(255,255,255,0.2);
        margin-top:8px; font-weight:600; text-shadow:0 0 10px rgba(255,255,255,0.2);
    }

    /* Floor */
    .svp-floor {
        position:absolute; bottom:0; left:0; right:0; height:45%;
        display:flex; flex-direction:column; justify-content:flex-end;
        perspective: 500px;
        perspective-origin: top;
    }
    .svp-floor-line {
        height:2px; background:linear-gradient(to right, transparent 5%, rgba(0,242,255,0.15) 50%, transparent 95%);
        margin:5px 0; transform-origin:center;
    }

    /* Audience silhouettes */
    .svp-audience {
        position:absolute; bottom:0; left:0; right:0;
        display:flex; flex-direction:column; align-items:center; gap:0px; padding-bottom:0px;
        pointer-events:none;
    }
    .svp-audience-row { display:flex; gap:12px; filter: drop-shadow(0 -5px 15px rgba(0,0,0,0.9)); }
    .svp-head {
        width:24px; height:30px; border-radius:50% 50% 40% 40%;
        background:linear-gradient(to bottom, #111, #000); 
        border-top:1px solid rgba(255,255,255,0.08); /* slight reflect from screen */
        box-shadow: inset 0 5px 10px rgba(255,255,255,0.03);
    }

    /* Info bar */
    .svp-info-bar {
        display:flex; justify-content:space-around; flex-wrap:wrap;
        padding:0.8rem 1rem; gap:8px; background:rgba(255,255,255,0.02);
    }
    .svp-info-item { display:flex; flex-direction:column; align-items:center; gap:2px; }
    .svp-info-label { font-size:0.6rem; color:rgba(255,255,255,0.3); letter-spacing:1px; text-transform:uppercase; }
    .svp-info-val { font-size:0.85rem; font-weight:700; color:#fff; }
    `;
    document.head.appendChild(style);
}


function toggleAddon(element, price) {
    const name = element.querySelector('h5').innerText;
    element.classList.toggle('active');

    if (element.classList.contains('active')) {
        addonTotal += price;
        selectedAddons.push(name);
    } else {
        addonTotal -= price;
        selectedAddons = selectedAddons.filter(a => a !== name);
    }
    updateSummary();
}

function toggleParking(element, type, price) {
    const cards = document.querySelectorAll('.parking-card');
    const isActive = element.classList.contains('active');

    cards.forEach(c => c.classList.remove('active'));

    if (isActive) {
        selectedParking = null;
    } else {
        element.classList.add('active');
        selectedParking = { type, price };
    }
    updateSummary();
}

function updateSummary() {
    const count = selectedSeats.length;
    let seatTotal = 0;
    const basePrice = currentMovie ? currentMovie.price : 0;

    selectedSeats.forEach(seatId => {
        const seatEl = document.querySelector(`.seat[data-seat-id="${seatId}"]`);
        const type = seatEl?.dataset.type || 'standard';
        if (type === 'premium') seatTotal += (basePrice + 50);
        else if (type === 'couple') seatTotal += (basePrice * 2);
        else seatTotal += basePrice;
    });

    let total = seatTotal + addonTotal;
    const parkingPrice = selectedParking ? selectedParking.price : 0;
    total += parkingPrice;
    
    const activePayment = document.querySelector('.payment-option.active span')?.innerText.toLowerCase() || '';
    let surcharge = 0;
    if (activePayment.includes('cash')) {
        surcharge = count * 50;
        total += surcharge;
    }

    let redeemed = JSON.parse(localStorage.getItem('cineflow_redeemed') || '[]');
    let discountMsg = "";
    if (redeemed.includes("Ticket Discount")) {
        total -= 150;
        discountMsg += " (₹150 Off Applied)";
    }
    if (total < 0) total = 0;

    const countEl = getEl('selected-seats-count');
    const addonPriceEl = getEl('summary-addons-price');
    const parkingPriceEl = getEl('summary-parking-price');
    const totalEl = getEl('total-price');

    if (countEl) countEl.innerText = count;
    if (addonPriceEl) addonPriceEl.innerText = `₹${addonTotal}`;
    if (parkingPriceEl) parkingPriceEl.innerText = `₹${parkingPrice}`;
    
    let finalSuffix = discountMsg;
    if (surcharge > 0) finalSuffix += ` (+₹${surcharge} Cash Charge)`;
    if (totalEl) totalEl.innerText = `₹${total} ${finalSuffix}`;
}

(function wireBookingModalActions() {
    const bookingModal = document.getElementById('booking-modal');
    if (!bookingModal) return;

    const firstClose = bookingModal.querySelector('.close-modal');
    if (firstClose) {
        firstClose.onclick = () => closeModal('booking-modal');
    }

    const confirmBtn = document.getElementById('confirm-booking');
    if (!confirmBtn) return;

    confirmBtn.onclick = () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        const btn = document.getElementById('confirm-booking');
        btn.innerText = "Redirecting to Payment...";
        btn.disabled = true;

        setTimeout(() => {
            btn.innerText = "Confirm Booking";
            btn.disabled = false;

            closeModal('booking-modal');
            let seatTotal = 0;
            const curMoviePrice = currentMovie ? currentMovie.price : 0;
            selectedSeats.forEach(seatId => {
                const seatEl = document.querySelector(`.seat[data-seat-id="${seatId}"]`);
                const type = seatEl?.dataset.type || 'standard';
                if (type === 'premium') seatTotal += (curMoviePrice + 50);
                else if (type === 'couple') seatTotal += (curMoviePrice * 2);
                else seatTotal += curMoviePrice;
            });

            let total = seatTotal + addonTotal;
            if (selectedParking) total += selectedParking.price;

            const activePayment = document.querySelector('.payment-option.active span')?.innerText.toLowerCase() || '';
            let surchargeMsg = "";
            if (activePayment.includes('cash')) {
                total += (selectedSeats.length * 50);
                surchargeMsg = ` (+₹${selectedSeats.length * 50} Cash Charge)`;
            }

            let redeemed = JSON.parse(localStorage.getItem('cineflow_redeemed') || '[]');
            let discountMsg = "";
            if (redeemed.includes("Ticket Discount")) {
                total -= 150;
                discountMsg += "(Ticket Disc Applied)";
            }
            if (total < 0) total = 0;

            const summaryText = getEl('checkout-summary-text');
            const finalAmount = getEl('final-payable-amount');
            if (summaryText) {
                const movieTitle = currentMovie?.title ?? 'Movie';
                summaryText.innerText = `${movieTitle} • ${selectedSeats.length} Seats ${discountMsg}${surchargeMsg}`;
            }
            if (finalAmount) finalAmount.innerText = `₹${total}`;

            const pm = getEl('payment-modal');
            if (pm) {
                const modalContent = pm.querySelector('.modal-content');
                if (modalContent) modalContent.style.maxWidth = '900px';
                pm.classList.add('active');
            }
        }, 800);
    };
})();

function processFinalPayment() {
    const btn = document.getElementById('final-pay-btn');
    if (!btn) return;
    const activePaymentMode = document.querySelector('.payment-option.active span')?.innerText.toLowerCase() || '';

    if (activePaymentMode.includes('upi')) {
        const upiId = document.getElementById('upi-id')?.value.trim();
        const upiRegex = /^\w+[\w\.\-]*@\w+$/;
        if (!upiId || !upiRegex.test(upiId)) {
            alert('Please enter a valid UPI ID, e.g. example@upi.');
            return;
        }
    } else if (activePaymentMode.includes('card')) {
        const cardNumber = document.getElementById('card-number')?.value.replace(/\s+/g, '');
        const cardExpiry = document.getElementById('card-expiry')?.value.trim();
        const cardCVV = document.getElementById('card-cvv')?.value.trim();

        if (!cardNumber || cardNumber.length !== 16 || !/^\d{16}$/.test(cardNumber)) {
            alert('Please enter a valid 16-digit card number.');
            return;
        }
        if (!cardExpiry || !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(cardExpiry)) {
            alert('Please enter a valid expiry in MM/YY format.');
            return;
        }
        if (!cardCVV || !/^\d{3,4}$/.test(cardCVV)) {
            alert('Please enter a valid CVV (3 or 4 digits).');
            return;
        }
    } else if (activePaymentMode.includes('banking')) {
        const bank = document.getElementById('bank-select')?.value;
        const user = document.getElementById('banking-user')?.value.trim();
        if (!bank) {
            alert('Please select your net banking provider.');
            return;
        }
        if (!user) {
            alert('Please enter your Internet banking user ID.');
            return;
        }
    } else if (activePaymentMode.includes('cash')) {
    }

    btn.innerText = "Securing Transaction...";
    btn.disabled = true;

    setTimeout(() => {
        const pm = getEl('payment-modal');
        if (pm) {
            pm.querySelectorAll('.checkout-header, .payment-details-container, .checkout-footer, .close-modal').forEach(el => {
                el.style.display = 'none';
            });
        }

        const successView = getEl('payment-success');
        if (successView) successView.classList.add('active');

        // Fallback: retrieve movie from stored movieId if currentMovie is null
        let movieToDisplay = currentMovie;
        if (!movieToDisplay) {
            const storedMovieId = localStorage.getItem('cineflow_current_booking_movieid');
            if (storedMovieId) {
                movieToDisplay = movies.find(m => m.id === parseInt(storedMovieId));
            }
        }

        const title = movieToDisplay?.title || 'Movie';
        const movieCode = title.split(' ').filter(w => w.length > 0).map(w => w[0]).join('').toUpperCase().substring(0, 3);
        const bookingId = `CF-${movieCode}-${Math.floor(1000 + Math.random() * 9000)}`;

        const bannerImg = document.getElementById('print-banner-img');
        if (bannerImg) {
            bannerImg.crossOrigin = "anonymous";
            bannerImg.src = movieToDisplay?.image || '';
        }

        document.getElementById('print-ticket-id').innerText = bookingId;
        document.getElementById('print-movie-title').innerText = title;
        document.getElementById('print-seats').innerText = selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Not Selected';
        document.getElementById('print-date').innerText = currentBookingInfo.date || 'TBD';
        document.getElementById('print-time').innerText = currentBookingInfo.time || 'TBD';
        document.getElementById('print-theater').innerText = currentBookingInfo.theater || 'TBD';

        const snacksList = [...selectedAddons];
        
        let localRedeemed = JSON.parse(localStorage.getItem('cineflow_redeemed') || '[]');
        if (localRedeemed.includes("Popcorn") && !snacksList.includes("Free Large Popcorn")) {
            snacksList.push("Free Large Popcorn");
        }

        const addonsList = getEl('print-addons-list');
        if (addonsList) {
            let addonsHtml = '';
            if (snacksList.length > 0) {
                addonsHtml += `
                    <div class="addon-print-tag">
                        <i data-lucide="utensils" style="width:16px;"></i> 
                        <span><b>REFRESHMENTS:</b> ${snacksList.join(', ')}</span>
                    </div>`;
            }
            if (selectedParking) {
                addonsHtml += `
                    <div class="addon-print-tag">
                        <i data-lucide="${selectedParking.type === 'Car' ? 'car' : 'bike'}" style="width:16px;"></i> 
                        <span><b>PARKING PASS:</b> ${selectedParking.type} Slot Allocated</span>
                    </div>`;
            }
            addonsList.innerHTML = addonsHtml;
        }

        const qrContainer = getEl('print-qr');
        if (qrContainer && typeof QRCode !== 'undefined') {
            qrContainer.innerHTML = '';
            new QRCode(qrContainer, {
                text: `VALID-TICKET-${bookingId}`,
                width: 90,
                height: 90,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }

        if (window.lucide) lucide.createIcons();

        const seatCount = selectedSeats.length;
        const moviePrice = movieToDisplay ? movieToDisplay.price : 0;
        let totalPaid = 0;
        (selectedSeats || []).forEach(seatId => {
            const seatEl = document.querySelector(`.seat[data-seat-id="${seatId}"]`);
            const type = seatEl?.dataset.type || 'standard';
            if (type === 'premium') totalPaid += (moviePrice + 50);
            else if (type === 'couple') totalPaid += (moviePrice * 2);
            else totalPaid += moviePrice;
        });
        totalPaid += addonTotal + (selectedParking ? selectedParking.price : 0);
        
        const activePaymentMode = document.querySelector('.payment-option.active span')?.innerText.toLowerCase() || '';
        if (activePaymentMode.includes('cash')) {
            totalPaid += (selectedSeats.length * 50);
        }
        
        let finalTotalToStore = totalPaid;
        let redeemedRewards = JSON.parse(localStorage.getItem('cineflow_redeemed') || '[]');
        if (redeemedRewards.includes("Ticket Discount")) {
            finalTotalToStore -= 150;
            if (finalTotalToStore < 0) finalTotalToStore = 0;
        }

        const currentUser = JSON.parse(localStorage.getItem('cineflow_user') || '{"email":"guest"}');
        
        const bookingRecord = {
            id: document.getElementById('print-ticket-id')?.innerText || bookingId,
            title: movieToDisplay?.title || 'Movie',
            genre: movieToDisplay?.genre || '',
            image: movieToDisplay?.image || '',
            seats: [...(selectedSeats || [])],
            date: currentBookingInfo?.date || 'TBD',
            time: currentBookingInfo?.time || 'TBD',
            theater: currentBookingInfo?.theater || 'TBD',
            total: finalTotalToStore,
            addons: [...snacksList],
            parking: selectedParking ? selectedParking.type : null,
            bookedOn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            userEmail: currentUser.email
        };

        const existing = JSON.parse(localStorage.getItem('cineflow_bookings') || '[]');
        existing.unshift(bookingRecord);
        localStorage.setItem('cineflow_bookings', JSON.stringify(existing));

        let pointsEarned = Math.floor(finalTotalToStore / 100) * 10;
        let currentPoints = parseInt(localStorage.getItem('cineflow_loyalty_points')) || 0;
        localStorage.setItem('cineflow_loyalty_points', currentPoints + pointsEarned);
        
        let redeemedState = JSON.parse(localStorage.getItem('cineflow_redeemed') || '[]');
        redeemedState = redeemedState.filter(item => item !== 'Ticket Discount' && item !== 'Popcorn');
        localStorage.setItem('cineflow_redeemed', JSON.stringify(redeemedState));

        updatePointsUI();

        const pRight = document.querySelector('.print-right');
        if(pRight) {
            let ptsDiv = document.createElement('div');
            ptsDiv.innerHTML = `<i data-lucide="sparkles" style="width: 14px; color: gold;"></i> +${pointsEarned} Points!`;
            ptsDiv.style.cssText = "margin-top: 1rem; color: gold; font-weight: bold; font-size: 0.9rem; text-align: center;";
            pRight.appendChild(ptsDiv);
        }
        btn.innerText = "Pay Now";
        btn.disabled = false;
        selectedSeats = [];
        // Clear stored movieId after successful booking
        localStorage.removeItem('cineflow_current_booking_movieid');
    }, 2000);
}

async function saveTicket() {
    const ticket = document.getElementById('ticket-to-print');
    const btn = document.querySelector('button[onclick="saveTicket()"]');
    btn.innerText = "Exporting Ticket...";

    try {
        const canvas = await html2canvas(ticket, {
            useCORS: true,
            backgroundColor: '#0a0a0b',
            scale: 2 // High quality
        });

        const link = document.createElement('a');
        link.download = `CineFlow-Ticket-${document.getElementById('print-ticket-id').innerText}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (e) {
        console.error("Save failed", e);
        alert("Failed to save ticket image.");
    } finally {
        btn.innerHTML = '<i data-lucide="download"></i> Save Ticket';
        if (window.lucide) lucide.createIcons();
    }
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function generateTicketQRs() {
    document.querySelectorAll('.qr-container').forEach(container => {
        const id = container.getAttribute('data-id');
        new QRCode(container, {
            text: `TICKET-ID: ${id}`,
            width: 80,
            height: 80,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    });
}


function toggleMobileNav() {
    const nav = document.getElementById('nav-links');
    const ham = document.getElementById('hamburger');
    if (!nav || !ham) return;
    nav.classList.toggle('open');
    ham.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            const nav = document.getElementById('nav-links');
            const ham = document.getElementById('hamburger');
            if (nav) nav.classList.remove('open');
            if (ham) ham.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

});


document.addEventListener('DOMContentLoaded', () => {
    const cities = ["New York", "London", "Mumbai", "Delhi", "Dubai", "Los Angeles", "Toronto", "Sydney", "Paris"];
    const moviesListForToast = [
        { title: "Dune: Part Two", img: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGqqUT1O.jpg" },
        { title: "Godzilla x Kong", img: "https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLvLuPE21pMEtcm.jpg" },
        { title: "Kung Fu Panda 4", img: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg" },
        { title: "Civil War", img: "https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg" },
        { title: "Kalki 2898 AD", img: "https://image.tmdb.org/t/p/w500/yXgAOhgHn1jVvK3e1yvHqVwU8E8.jpg" }
    ];

    function createToastContainer() {
        let toast = document.createElement('div');
        toast.className = 'realtime-booking-toast';
        toast.id = 'realtime-booking-toast';
        document.body.appendChild(toast);
        return toast;
    }

    function showBookingToast() {
        if (document.hidden) return;

        let toast = document.getElementById('realtime-booking-toast') || createToastContainer();
        
        const city = cities[Math.floor(Math.random() * cities.length)];
        const seats = Math.floor(Math.random() * 4) + 1; // 1 to 4 seats
        const movie = moviesListForToast[Math.floor(Math.random() * moviesListForToast.length)]; // Random movie
        const timeAgo = Math.floor(Math.random() * 59) + 1; // 1 to 59 seconds ago

        toast.innerHTML = `
            <img src="${movie.img}" alt="${movie.title}">
            <div class="realtime-toast-content">
                <div class="realtime-toast-title">Someone in ${city} booked <span>${seats} ticket${seats > 1 ? 's' : ''}</span> for <b>${movie.title}</b></div>
                <div class="realtime-toast-time">${timeAgo} seconds ago • Selling fast! 🔥</div>
            </div>
        `;

        void toast.offsetWidth;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    function scheduleNextToast() {
        const nextDelay = Math.floor(Math.random() * 10000) + 15000; // Between 15s and 25s
        setTimeout(() => {
            showBookingToast();
            scheduleNextToast();
        }, nextDelay);
    }

    setTimeout(() => {
        showBookingToast();
        scheduleNextToast();
    }, 3000 + Math.random() * 3000);
});