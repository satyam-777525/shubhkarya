import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  CalendarDays,
  Book,
  LogOut,
  ListChecks,
  MessageCircle,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkle, // Added for visual flair on features
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Dashboard.css";
import {
  createReview,
  getBookings,
  getVerifiedPandits,
} from "../api/api";
import ChatWindow from "./ChatWindow";
import { useNavigate } from "react-router-dom";

// Feature card data for easier rendering and extension
const featureCardsData = [
    {
        title: "Live Chat Support",
        description: "Ask spiritual or booking questions to our team – instant help, 7am to 10pm.",
        icon: MessageCircle,
    },
    {
        title: "Preferred Pandit Booking",
        description: "Save favorite Pandits, see their next available slots, and book with just one tap.",
        icon: Users, // Using Users for pandit-related feature
    },
    {
        title: "Festive Offers",
        description: "Special discounts and promo codes for all major festivals and family events.",
        icon: Sparkle, // Using Sparkle for festive/special flair
    },
];

const sidebarLinks = [
  { label: "Home", icon: Home, goto: "/" },
  { label: "Book Puja", icon: Book, goto: "#book-puja" }, // Link to new section
  { label: "Submit Review", icon: MessageCircle, goto: "#review" },
  { label: "Pandits", icon: Users, goto: "#pandit" },
  { label: "Search", icon: Search, goto: "#highlight" }, // Re-using for general highlights/top section
  { label: "Bookings", icon: CalendarDays, goto: "#booking" },
  { label: "Logout", icon: LogOut, goto: "/home", logout: true },
];

const sliderImages = [
  "/images/i2.jpeg",
  "/images/kalash.jpeg",
  "/images/havan.jpeg",
  "/images/i3.jpeg",
  "/images/i1.jpeg",
];

function StarRating({ rating, onChange }) {
  return (
    <div className="star-rating" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          role="button"
          tabIndex="0"
          className={`star ${i <= rating ? "active" : ""}`}
          aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
          onClick={() => onChange(i)}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && onChange(i)
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [expandedPandits, setExpandedPandits] = useState({});
  const [searchPandits, setSearchPandits] = useState("");
  const [searchBookings, setSearchBookings] = useState("");
  const [review, setReview] = useState({ name: "", rating: 0, comment: "" });
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatPanditId, setChatPanditId] = useState(null);
  const [chatPanditName, setChatPanditName] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");

  // Booking state integrated in dashboard
  const [selectedPanditId, setSelectedPanditId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [bookingDetails, setBookingDetails] = useState({
    puja_date: "",
    puja_time: "",
    location: "",
  });
  const [bookingStatus, setBookingStatus] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const navigate = useNavigate();

  const panditListRef = useRef(null);
  const bookingListRef = useRef(null);

  // Fetch user, bookings, pandits on mount
  useEffect(() => {
    AOS.init({ duration: 750, once: true });
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      // If no token or user data, redirect to login
      navigate('/login'); // Assuming '/login' is your login route
      return;
    }
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setReview((r) => ({ ...r, name: parsedUser.name }));
      fetchBookings(parsedUser._id);
      fetchPandits();
    } catch (e) {
      console.error("Failed to parse user data or fetch initial data:", e);
      localStorage.clear(); // Clear invalid data
      navigate('/login'); // Redirect to login
    }
  }, []);

  const fetchBookings = async (userId) => {
    try {
      const res = await getBookings({ userid: userId });
      setBookings(res.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      // Optionally set an error message for the user
    }
  };

  const fetchPandits = async () => {
    try {
      const res = await getVerifiedPandits();
      setPandits(res.data || []);
    } catch (error) {
      console.error("Failed to fetch pandits:", error);
      // Optionally set an error message for the user
    }
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % sliderImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const itv = setInterval(() => {
      setCurrentDateTime(
        new Date().toLocaleString("en-IN", {
          dateStyle: "full",
          timeStyle: "medium",
          timeZone: "Asia/Kolkata",
        })
      );
    }, 1000);
    return () => clearInterval(itv);
  }, []);

  function toggleExpand(id) {
    setExpandedPandits((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const getStatusClass = (status) =>
    ({
      accepted: "status accepted",
      rejected: "status rejected",
      pending: "status pending",
    }[(status || "").toLowerCase()] || "status");

  const filteredPandits = pandits.filter(
    (p) =>
      (p.name?.toLowerCase() || "").includes(searchPandits.toLowerCase()) ||
      (p.city || "").toLowerCase().includes(searchPandits.toLowerCase()) ||
      (p.specialties || []).some(s => s.toLowerCase().includes(searchPandits.toLowerCase())) // Search by specialties
  );

  const filteredBookings = bookings.filter((b) => {
    const q = searchBookings.toLowerCase();
    return (
      (b.panditid?.name || "").toLowerCase().includes(q) ||
      (b.serviceid?.name || "").toLowerCase().includes(q) ||
      new Date(b.puja_date).toLocaleDateString().includes(q) ||
      (b.location || "").toLowerCase().includes(q) // Search by location
    );
  });

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!review.name || !review.comment || !review.rating) {
      setReviewMessage("Please complete all fields and provide star rating.");
      return;
    }
    setReviewLoading(true);
    try {
      await createReview(review);
      setReviewMessage("Thank you for your review!");
      setReview((r) => ({ name: r.name, rating: 0, comment: "" }));
    } catch {
      setReviewMessage("Failed to submit review.");
    } finally {
      setReviewLoading(false);
      setTimeout(() => setReviewMessage(""), 2500);
    }
  }

  function handleNavClick(item) {
    if (item.logout) {
      localStorage.clear();
      navigate(item.goto); // Navigate to home/login after logout
    } else if (String(item.goto).startsWith("#")) {
      const section = document.querySelector(item.goto);
      if (section)
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
    } else {
      navigate(item.goto);
    }
  }

  function scrollList(ref, direction = "left") {
    if (ref.current) {
      const scrollAmount = 320;
      if (direction === "left") {
        ref.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  }

  // Booking form handlers
  function handlePanditSelect(e) {
    const panditId = e.target.value;
    setSelectedPanditId(panditId);
    setSelectedServiceId(""); // reset selected service on pandit change
    setBookingStatus(null);
  }

  function handleServiceSelect(e) {
    setSelectedServiceId(e.target.value);
    setBookingStatus(null);
  }

  function handleBookingDetailsChange(e) {
    const { name, value } = e.target;
    setBookingDetails((b) => ({ ...b, [name]: value }));
    setBookingStatus(null);
  }

  async function handleBookingSubmit(e) {
    e.preventDefault();
    setBookingStatus(null);

    if (!selectedPanditId) {
      setBookingStatus({ error: "Please select a Pandit." });
      return;
    }
    if (!selectedServiceId) {
      setBookingStatus({ error: "Please select the Puja/service." });
      return;
    }
    if (
      !bookingDetails.puja_date ||
      !bookingDetails.puja_time ||
      !bookingDetails.location.trim()
    ) {
      setBookingStatus({ error: "Please fill all booking details." });
      return;
    }
    if(!user?._id) {
      setBookingStatus({ error: "User not found. Please login again." });
      // Consider redirecting to login or forcing re-authentication
      return;
    }

    setBookingLoading(true);

    try {
      const payload = {
        userId: user._id,
        panditId: selectedPanditId,
        serviceId: selectedServiceId,
        puja_date: bookingDetails.puja_date,
        puja_time: bookingDetails.puja_time,
        location: bookingDetails.location.trim(),
        status: "pending", // Initial status
      };

      await bookPuja(payload); // Call your actual API

      setBookingStatus({ success: "Puja booked successfully! Awaiting Pandit confirmation." });

      // Refresh bookings list after successful booking
      fetchBookings(user._id);

      // Reset booking form
      setSelectedPanditId("");
      setSelectedServiceId("");
      setBookingDetails({ puja_date: "", puja_time: "", location: "" });
    } catch (error) {
      console.error("Booking error:", error);
      setBookingStatus({
        error:
          error?.response?.data?.message || // More specific error from API
          "Failed to book puja. Please try again later.",
      });
    } finally {
      setBookingLoading(false);
      setTimeout(() => setBookingStatus(null), 3500); // Clear status message after a few seconds
    }
  }

  // Get selected pandit's services (pujas)
  const selectedPandit =
    pandits.find((p) => p._id === selectedPanditId) || null;

  const servicesOptions = selectedPandit?.services || [];

  return (
    <div className="dashboard-app-bg">
      {/* Sidebar */}
      <aside className={`sidebar-root${collapsed ? " collapsed" : ""}`}>
        <div className="sidebar-brand">
          <img src="/images/subh.png" alt="Shubhkarya Logo" className="sidebar-logo" />
          {!collapsed && (
            <span
              className="sidebar-brand-name white-logo"
              tabIndex={0}
              style={{ color: "#1abc9c" }}
            >
              Shubhkarya
            </span>
          )}
        </div>
        <nav className="sidebar-links" aria-label="Main navigation">
          {sidebarLinks.map(({ label, icon: Icon, goto, logout }) => (
            <button
              key={label}
              className="sidebar-link"
              tabIndex={0}
              onClick={() => handleNavClick({ goto, logout })}
              aria-label={label}
            >
              <Icon
                size={22}
                className="sidebar-link-icon"
                aria-hidden="true"
                style={{ color: "#1abc9c" }}
              />
              {!collapsed && (
                <span style={{ color: "#1abc9c", fontWeight: "700" }}>
                  {label}
                </span>
              )}
            </button>
          ))}
        </nav>
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{ color: "#1abc9c" }}
        >
          <ListChecks size={22} />
        </button>
      </aside>

      {/* Header */}
      <header className="header-root dark-header">
        <div className="user-block">
          <div>
            <div className="header-user-welcome dark-welcome">
              {user?.name ? `Welcome, ${user.name}!` : "Welcome to Shubhkarya"}
            </div>
            <div className="header-user-email dark-email">
              {user?.email || "user@example.com"}
            </div>
          </div>
        </div>
        <div className="header-datetime dark-datetime">{currentDateTime}</div>
      </header>

      <main className="dashboard-main">
        {/* Hero & Slider */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Experience{" "}
              <span className="hero-highlight">Auspicious Rituals</span> with{" "}
              <span className="hero-brand-white">Shubhkarya</span>
            </h1>
            <p className="hero-subtitle">
              Welcome{user?.name && <span>, <b>{user.name}</b></span>}!
              <br />
              Book trusted Pandits for your{" "}
              <span style={{ color: "#00E0D1", fontWeight: 600 }}> {/* Changed color to match highlight */}
                pujas, havans, and ceremonies
              </span>{" "}
              with elegance and ease.
              <br />
              Now enhanced with same-day bookings and instant chat support.
            </p>
            <div className="hero-actions">
              <button
                className="main-cta-btn"
                onClick={() => {
                    const bookPujaSection = document.querySelector("#book-puja");
                    if (bookPujaSection) {
                        bookPujaSection.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                }}
              >
                Book Puja Now
              </button>
              <button
                className="main-alt-btn"
                onClick={() => {
                  const panditSection = document.querySelector("#pandit");
                  if (panditSection) {
                    panditSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Browse Pandits
              </button>
            </div>
          </div>
          <div className="slider-wrapper">
            <div className="carousel-frame hero-slider-bg">
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={carouselIndex}
                  src={sliderImages[carouselIndex]}
                  alt={`Slide ${carouselIndex + 1}`}
                  loading="lazy"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
              <div className="carousel-dots">
                {sliderImages.map((_, i) => (
                  <button
                    key={i}
                    className={`carousel-dot${carouselIndex === i ? " active" : ""}`}
                    onClick={() => setCarouselIndex(i)}
                    aria-selected={carouselIndex === i}
                    role="tab"
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <div className="slider-caption">
                <div>
                  Find <span style={{ color: "#00E0D1" }}>expert guidance</span>{" "} {/* Changed color to match highlight */}
                  for every ritual
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="dashboard-features" data-aos="fade-up">
            {featureCardsData.map((feature, index) => (
                <div className="feature-card" key={index}>
                    {feature.icon && <feature.icon size={36} color="var(--highlight-color)" style={{marginBottom: '10px'}} />}
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                </div>
            ))}
        </section>

        {/* Verified Pandits */}
        <section
          id="pandit"
          className="pandit-section horizontal-carousel-section"
          tabIndex={-1}
          aria-label="Verified Pandits"
        >
          <div className="section-header">
            <h3 className="section-heading highlighted-heading">Verified Pandits</h3>
            <div className="carousel-controls">
              <button
                aria-label="Scroll pandits left"
                onClick={() => scrollList(panditListRef, "left")}
                className="carousel-arrow-btn"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                aria-label="Scroll pandits right"
                onClick={() => scrollList(panditListRef, "right")}
                className="carousel-arrow-btn"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          <input
            type="text"
            className="booking-search"
            aria-label="Search pandits by name, city, or specialty"
            placeholder="Search by name, city, or specialty..."
            value={searchPandits}
            onChange={(e) => setSearchPandits(e.target.value)}
          />
          <div
            className="pandit-list horizontal-scroll"
            ref={panditListRef}
            tabIndex={0}
            role="list" // ARIA role for list
          >
            {filteredPandits.length === 0 ? (
                <p className="empty-msg">No Pandits found matching your search. Try a different term.</p>
            ) : (
                filteredPandits.map((pandit) => (
                    <motion.div
                        key={pandit._id}
                        className="improved-pandit-card neon-card glass-highlight glossy shadow-pop horizontal-card"
                        whileHover={{ y: -8, scale: 1.02 }} // Enhanced hover effect
                        tabIndex={0}
                        aria-expanded={expandedPandits[pandit._id] || false}
                        onClick={() => toggleExpand(pandit._id)}
                        onKeyDown={(e) =>
                            (e.key === "Enter" || e.key === " ") && toggleExpand(pandit._id)
                        }
                        role="listitem" // ARIA role for list item
                    >
                        <div
                            className="pandit-avatar glass"
                            style={{
                                backgroundImage: `url(${pandit.profile_photo_url || "/images/i1.jpeg"})`,
                            }}
                            aria-label={`Pandit ${pandit.name}'s profile photo`}
                        >
                            <span className="pandit-avatar-initial">{pandit.name.slice(0, 1)}</span>
                        </div>
                        <div className="pandit-main-info">
                            <h4 className="pandit-name hero-text-glow">🧑‍🦳 {pandit.name}</h4>
                            <div className="pandit-city">{pandit.city}</div>
                            {expandedPandits[pandit._id] && (
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="pandit-extra expanded horizontal-extra"
                                    >
                                        <div className="pandit-details">
                                            <div className="pandit-badges">
                                                <span className="pandit-badge exp">
                                                    Exp: {pandit.experienceYears} yrs
                                                </span>
                                                <span className="pandit-badge langs">
                                                    {pandit.languages?.join(", ")}
                                                </span>
                                            </div>
                                            <div className="pandit-specialties">
                                                <b>Specialties:</b> {pandit.specialties?.join(", ")}
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                            <button
                                className="custom-btn glow-btn" // Re-using existing button styles
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setChatPanditId(pandit._id);
                                    setChatPanditName(pandit.name);
                                    setShowChatbot(false); // Hide general chatbot if opening specific chat
                                }}
                                style={{ marginTop: 8 }}
                                aria-label={`Chat with ${pandit.name}`}
                            >
                                Chat with Pandit
                            </button>
                        </div>
                    </motion.div>
                ))
            )}
          </div>
        </section>

        {/* NEW Booking Section - Integrated on same page */}
        <section
          id="book-puja"
          className="book-puja-section glass-review"
          aria-label="Book Puja"
          tabIndex={-1}
          style={{ marginTop: "3rem", marginBottom: "3rem", maxWidth: 700, marginLeft:"auto", marginRight:"auto" }}
        >
          <h3 className="section-heading highlighted-heading" style={{ textAlign: "center" }}>
            Book Your Puja
          </h3>

          <form onSubmit={handleBookingSubmit} className="booking-form-dashboard" aria-live="polite" noValidate>
            <label htmlFor="selectPandit">Select Pandit:</label>
            <select
              id="selectPandit"
              value={selectedPanditId}
              onChange={handlePanditSelect}
              aria-required="true"
              required
            >
              <option value="">-- Select Pandit --</option>
              {filteredPandits.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.city})
                </option>
              ))}
            </select>

            <label htmlFor="selectPuja">Select Puja / Service:</label>
            <select
              id="selectPuja"
              value={selectedServiceId}
              onChange={handleServiceSelect}
              aria-required="true"
              required
              disabled={!selectedPandit || servicesOptions.length === 0}
            >
              <option value="">
                {selectedPandit
                  ? servicesOptions.length > 0
                    ? "-- Select Puja --"
                    : "No services available for this Pandit" // More specific message
                  : "Select Pandit first to see services"} {/* More helpful message */}
              </option>
              {servicesOptions.map((svc) => (
                <option key={svc._id || svc.id} value={svc._id || svc.id}>
                  {svc.name} - ₹{svc.price?.toLocaleString()} {/* Display price if available */}
                </option>
              ))}
            </select>

            <label htmlFor="puja_date">Select Date:</label>
            <input
              type="date"
              id="puja_date"
              name="puja_date"
              value={bookingDetails.puja_date}
              onChange={handleBookingDetailsChange}
              min={new Date().toISOString().split("T")[0]}
              aria-required="true"
              required
            />

            <label htmlFor="puja_time">Select Time:</label>
            <input
              type="time"
              id="puja_time"
              name="puja_time"
              value={bookingDetails.puja_time}
              onChange={handleBookingDetailsChange}
              aria-required="true"
              required
            />

            <label htmlFor="location">Location / Address:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={bookingDetails.location}
              onChange={handleBookingDetailsChange}
              placeholder="Enter location or address"
              aria-required="true"
              required
              autoComplete="street-address"
            />

            <button
              type="submit"
              className="custom-btn glow-btn"
              disabled={bookingLoading}
            >
              {bookingLoading ? "Booking Puja..." : "Confirm Booking"}
            </button>
            {bookingStatus?.error && (
              <p className="error-message" role="alert">{bookingStatus.error}</p>
            )}
            {bookingStatus?.success && (
              <p className="success-message" role="alert">{bookingStatus.success}</p>
            )}
          </form>
        </section>

        {/* Chat Window */}
        <AnimatePresence>
          {chatPanditId && (
            <ChatWindow
              userId={user?._id}
              panditId={chatPanditId}
              chatName={chatPanditName}
              onClose={() => setChatPanditId(null)}
            />
          )}
        </AnimatePresence>

        {/* Bookings */}
        <section
          id="booking"
          className="bookings-section horizontal-carousel-section blur-bg"
          tabIndex={-1}
          aria-label="Booking History"
        >
          <div className="section-header">
            <h3 className="section-heading highlighted-heading">Your Bookings</h3>
            <div className="carousel-controls">
              <button
                aria-label="Scroll bookings left"
                onClick={() => scrollList(bookingListRef, "left")}
                className="carousel-arrow-btn"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                aria-label="Scroll bookings right"
                onClick={() => scrollList(bookingListRef, "right")}
                className="carousel-arrow-btn"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          <input
            type="text"
            className="booking-search"
            aria-label="Search bookings by Pandit, service, date, or location"
            placeholder="Search bookings by Pandit, service, date, or location..."
            value={searchBookings}
            onChange={(e) => setSearchBookings(e.target.value)}
          />
          <div
            className="booking-list horizontal-scroll"
            ref={bookingListRef}
            tabIndex={0}
            role="list" // ARIA role for list
          >
            {filteredBookings.length === 0 ? (
              <p className="empty-msg">
                No bookings found. <a href="#book-puja" onClick={(e) => { e.preventDefault(); document.querySelector("#book-puja").scrollIntoView({ behavior: "smooth" }); }} style={{color: 'var(--highlight-color)', textDecoration: 'underline'}}>Book your first puja now!</a>
              </p>
            ) : (
              filteredBookings.map((b) => (
                <motion.div
                  key={b._id}
                  className="booking-card card-glossy glass neon-card shadow-pop horizontal-card"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 32px rgba(0, 0, 0, 0.2)" }} // Enhanced hover
                  tabIndex={0}
                  role="article"
                  aria-label={`Booking for ${b.serviceid?.name} with ${
                    b.panditid?.name || "N/A"
                  } on ${new Date(b.puja_date).toLocaleDateString()} at ${
                    b.puja_time
                  }`}
                >
                  <div className="booking-card-left">
                    <span className="booking-icon" aria-hidden="true">
                      📅
                    </span>
                    <div>
                      <div className="booking-type">{b.serviceid?.name}</div>
                      <div className="booking-date">
                        {new Date(b.puja_date).toLocaleDateString()} at {b.puja_time}
                      </div>
                    </div>
                  </div>
                  <div className="booking-card-right">
                    <div className="booking-pandit">
                      <span className="booking-pandit-label">Pandit:</span>{" "}
                      <span>{b.panditid?.name ?? "N/A"}</span>
                    </div>
                    <div className="booking-location">📍 {b.location}</div>
                    <div className={getStatusClass(b.status)}>{b.status}</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Review Submission */}
        <section
          id="review"
          className="review-section glass-review"
          tabIndex={-1}
          aria-label="Submit Review"
        >
          <h3 className="section-heading neon-text">Submit a Review</h3>
          {reviewMessage && (
            <p
              className={
                reviewMessage.includes("Thank you") // Check for success message content
                  ? "success-message"
                  : "error-message"
              }
              role="alert"
            >
              {reviewMessage}
            </p>
          )}
          <form
            onSubmit={handleReviewSubmit}
            className="review-form card-glossy glass nice-glass"
            aria-label="Review submission form"
          >
            <div className="review-row">
              <input
                type="text"
                value={user?.name || "Your Name"} // Display actual user name or placeholder
                disabled
                className="review-input"
                aria-label="Your name (disabled)"
              />
              <StarRating
                rating={review.rating}
                onChange={(v) => setReview((prev) => ({ ...prev, rating: v }))}
              />
            </div>
            <textarea
              placeholder="Share your experience with Shubhkarya and our services..." // More engaging placeholder
              value={review.comment}
              onChange={(e) =>
                setReview((prev) => ({ ...prev, comment: e.target.value }))
              }
              className="review-input review-textarea"
              required
              aria-required="true"
            />
            <button
              type="submit"
              className="custom-btn glow-btn"
              disabled={reviewLoading}
            >
              {reviewLoading ? "Submitting Review..." : "Submit Review 💬"}
            </button>
          </form>
        </section>

        {/* Chatbot Button */}
        <button
          aria-label="Toggle Chatbot"
          className="chatbot-toggle"
          onClick={() => setShowChatbot((s) => !s)}
        >
          {showChatbot ? (
            <span style={{ fontSize: 30, color: 'white' }}>×</span>
          ) : (
            <img
              src="/images/subh.png"
              alt="Open Chatbot"
              style={{ borderRadius: "50%", width: 38, height: 38 }}
            />
          )}
        </button>
        {showChatbot && (
          <div
            className="chatbot-popup"
            role="dialog"
            aria-modal="true"
            aria-label="Chatbot window"
          >
            <iframe
              title="Chatbot"
              src="https://www.chatbase.co/chatbot-iframe/usovl2iS71gPfrO5xmRyP"
              style={{ width: "100%", height: "100%", border: "none", borderRadius: 15 }}
              allow="clipboard-write"
            />
          </div>
        )}
      </main>
    </div>
  );
}