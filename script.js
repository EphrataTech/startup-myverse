// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded - Script starting...")

  // Check if Puter.js is loaded
  if (typeof puter === "undefined") {
    console.error("Puter.js is not loaded! Check the script tag in HTML.")
    document
      .getElementById("chatMessages")
      ?.insertAdjacentHTML(
        "beforeend",
        '<div class="bot-message">Sorry, the chatbot is currently unavailable. Please try again later.</div>',
      )
  } else {
    console.log("Puter.js is available")
  }

  // Initialize all features with error handling
  try {
    setupTheme()
    console.log("Theme setup complete")
  } catch (error) {
    console.error("Error setting up theme:", error)
  }

  try {
    setupFAQ()
    console.log("FAQ setup complete")
  } catch (error) {
    console.error("Error setting up FAQ:", error)
  }

  try {
    setupBackToTop()
    console.log("Back to top setup complete")
  } catch (error) {
    console.error("Error setting up back to top:", error)
  }

  try {
    setupVisitorCounter()
    console.log("Visitor counter setup complete")
  } catch (error) {
    console.error("Error setting up visitor counter:", error)
  }

  try {
    setupAudienceToggle()
    console.log("Audience toggle setup complete")
  } catch (error) {
    console.error("Error setting up audience toggle:", error)
  }

  try {
    setupCarousel()
    console.log("Carousel setup complete")
  } catch (error) {
    console.error("Error setting up carousel:", error)
  }

  // Setup chatbot last (it's async)
  try {
    setupChatbot()
    console.log("Chatbot setup initiated")
  } catch (error) {
    console.error("Error setting up chatbot:", error)
  }

  // Initialize Lucide icons if available
  if (typeof lucide !== "undefined") {
    try {
      lucide.createIcons()
      console.log("Lucide icons initialized")
    } catch (error) {
      console.error("Error initializing Lucide icons:", error)
    }
  }

  console.log("All setup functions called")
})

// Audience Toggle functionality
function setupAudienceToggle() {
  console.log("Setting up audience toggle...")

  const toggle = document.getElementById("audienceToggle")
  const studentsContent = document.getElementById("studentsContent")
  const professionalsContent = document.getElementById("professionalsContent")
  const toggleLabels = document.querySelectorAll(".toggle-label")

  if (!toggle || !studentsContent || !professionalsContent) {
    console.error("Audience toggle elements not found!")
    console.log("Toggle:", toggle)
    console.log("Students content:", studentsContent)
    console.log("Professionals content:", professionalsContent)
    return
  }

  toggle.addEventListener("change", function () {
    console.log("Toggle changed:", this.checked)
    if (this.checked) {
      // Show professionals content
      studentsContent.classList.remove("active")
      professionalsContent.classList.add("active")

      // Update labels
      toggleLabels.forEach((label) => {
        if (label.dataset.audience === "professionals") {
          label.classList.add("active")
        } else {
          label.classList.remove("active")
        }
      })
    } else {
      // Show students content
      professionalsContent.classList.remove("active")
      studentsContent.classList.add("active")

      // Update labels
      toggleLabels.forEach((label) => {
        if (label.dataset.audience === "students") {
          label.classList.add("active")
        } else {
          label.classList.remove("active")
        }
      })
    }
  })

  // Handle label clicks
  toggleLabels.forEach((label) => {
    label.addEventListener("click", function () {
      const audience = this.dataset.audience
      console.log("Label clicked:", audience)
      if (audience === "professionals") {
        toggle.checked = true
      } else {
        toggle.checked = false
      }
      toggle.dispatchEvent(new Event("change"))
    })
  })
}

// Carousel functionality - FIXED VERSION
function setupCarousel() {
  console.log("Setting up carousel...")

  const track = document.getElementById("carouselTrack")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const indicators = document.querySelectorAll(".indicator")

  if (!track || !prevBtn || !nextBtn) {
    console.error("Carousel elements not found!")
    console.log("Track:", track)
    console.log("Prev button:", prevBtn)
    console.log("Next button:", nextBtn)
    return
  }

  let currentSlide = 0
  const slides = document.querySelectorAll(".carousel-slide")
  const totalSlides = slides.length || 3
  console.log(`Found ${totalSlides} slides`)

  // FIXED: Direct function assignment instead of event listeners
  function updateCarousel() {
    console.log(`Moving to slide ${currentSlide}`)
    const translateX = -currentSlide * 100
    track.style.transform = `translateX(${translateX}%)`

    // Update indicators
    indicators.forEach((indicator, index) => {
      if (index === currentSlide) {
        indicator.classList.add("active")
      } else {
        indicator.classList.remove("active")
      }
    })
  }

  function nextSlide() {
    console.log("Next button clicked")
    currentSlide = (currentSlide + 1) % totalSlides
    updateCarousel()
  }

  function prevSlide() {
    console.log("Prev button clicked")
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
    updateCarousel()
  }

  // FIXED: Direct click handlers
  nextBtn.onclick = nextSlide
  prevBtn.onclick = prevSlide

  // Also add event listeners as backup
  nextBtn.addEventListener("click", nextSlide)
  prevBtn.addEventListener("click", prevSlide)

  // Indicator clicks
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      currentSlide = index
      updateCarousel()
    })
  })

  // Touch/swipe support for mobile
  let startX = 0
  let endX = 0

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX
  })

  track.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX
    const diff = startX - endX

    if (Math.abs(diff) > 50) {
      // Minimum swipe distance
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
  })

  console.log("Carousel setup complete")
}

// Chatbot functionality with Puter.js - FIXED VERSION
let startupContext = "" // Will store our startup context

async function setupChatbot() {
  console.log("Setting up chatbot with Puter.js...")

  const chatForm = document.getElementById("chatForm")
  const chatInput = document.getElementById("chatInput")
  const chatMessages = document.getElementById("chatMessages")

  if (!chatForm || !chatInput || !chatMessages) {
    console.error("Chatbot elements not found!")
    console.log("Chat form:", chatForm)
    console.log("Chat input:", chatInput)
    console.log("Chat messages:", chatMessages)
    return
  }

  // Load context from file (bonus feature)
  try {
    console.log("Attempting to load context.txt...")
    const response = await fetch("context.txt")
    if (response.ok) {
      startupContext = await response.text()
      console.log("Context loaded successfully:", startupContext.substring(0, 100) + "...")
    } else {
      console.error("Failed to load context file, status:", response.status)
      throw new Error("Context file not found")
    }
  } catch (error) {
    console.error("Error loading context:", error)
    // Fallback to hardcoded context if file loading fails
    startupContext = `
      Verse is a platform for emotional expression through poetry and creative writing.
      
      ORIGIN STORY:
      Verse was born out of a need for powerful emotional expression. We found that many people struggle with articulating difficult feelings, whether it's anxiety, depression, or simply the weight of daily life. Traditional journaling can feel overwhelming, so we created a space where digital poetry is free, one word at a time.
      
      MISSION:
      To provide a quiet space to feel, reflect, and release — one word at a time. We believe that everyone has a story worth telling, and sometimes the most profound truths emerge when we strip away everything but the essential.
      
      PRODUCTS:
      1. Verse Focus - Helps users find their flow. Step into silence with gentle cues that guide your mind into clarity. Turns chaos into calm and intention into action.
      2. Verse Journal - For soul whispers. Let your thoughts spill like ink on water. Tag your emotions, themes, and moments as they rise. A mirror of your mind - organized, gentle, and always listening.
      3. Verse Mood - Feel, reflect & release. Mark the rhythms of your day with soft questions and gentle prompts that bring awareness to each feeling. Encourages reflection and emotional growth over time.
      
      TEAM:
      - Ephrata Yohannes: Founder & UX Designer
      - Mahder Hawaz: Brand Storyteller & Content Strategist
      - Robel Alemayehu: Visual Designer
      
      VISION:
      To create a world where everyone can express their emotions freely and authentically, finding calm and clarity through the power of words. We want to meet people where they are and help them navigate their emotional landscape through guided poetic expression.
      
      CONTACT:
      Users can reach us through our contact form on the website, via email at ephrata0327@gmail.com, or through our LinkedIn and GitHub profiles linked in the footer.
    `
    console.log("Using fallback context")
  }

  // Add welcome message
  addMessage("bot", "Hi! I'm Versebot 👋 Ask me about Verse!")

  // FIXED: Direct form submission handler
  chatForm.onsubmit = handleChatSubmit

  // FIXED: Also add event listener as backup
  chatForm.addEventListener("submit", handleChatSubmit)

  // Handle sample buttons
  document.querySelectorAll(".sample-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      console.log("Sample button clicked:", this.textContent)
      chatInput.value = this.textContent
      // FIXED: Manually trigger form submission
      handleChatSubmit(new Event("submit"))
    })
  })

  // FIXED: Separated chat submission handler
  async function handleChatSubmit(e) {
    e.preventDefault()
    console.log("Chat form submitted")

    const message = chatInput.value.trim()
    if (!message) {
      // Handle empty input
      addMessage("bot", "Please enter a question about Verse.")
      return
    }

    console.log("User message:", message)

    // Add user message
    addMessage("user", message)
    chatInput.value = ""

    // Add typing indicator
    const typingIndicator = document.createElement("div")
    typingIndicator.className = "bot-message typing-indicator"
    typingIndicator.innerHTML = "Versebot is typing<span class='dots'>...</span>"
    chatMessages.appendChild(typingIndicator)
    chatMessages.scrollTop = chatMessages.scrollHeight

    // FIXED: Check if Puter is available and properly defined
    if (typeof puter === "undefined" || !puter.ai || !puter.ai.chat) {
      console.error("Puter.js AI chat is not available")
      if (chatMessages.contains(typingIndicator)) {
        chatMessages.removeChild(typingIndicator)
      }
      const fallbackResponse = getFallbackResponse(message)
      addMessage("bot", fallbackResponse)
      return
    }

    try {
      console.log("Calling Puter.js AI chat...")
      // Use Puter.js AI chat
      const response = await puter.ai.chat({
        system: `You are Versebot, the AI assistant for Verse, a startup focused on emotional expression through poetry. 
                Answer questions based on this context about Verse: ${startupContext}
                Keep your answers concise, friendly, and on-brand. If you don't know something specific, 
                say you don't have that information rather than making it up.`,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      })

      console.log("Puter.js response received:", response)

      // Remove typing indicator
      if (chatMessages.contains(typingIndicator)) {
        chatMessages.removeChild(typingIndicator)
      }

      // Add bot response
      if (response && response.message && response.message.content) {
        addMessage("bot", response.message.content)
      } else {
        console.error("Invalid response format from Puter.js")
        addMessage("bot", "I'm having trouble processing your request. Please try again.")
      }
    } catch (error) {
      console.error("Error with Puter.js chat:", error)

      // Remove typing indicator
      if (chatMessages.contains(typingIndicator)) {
        chatMessages.removeChild(typingIndicator)
      }

      // Fallback to basic responses if Puter.js fails
      const fallbackResponse = getFallbackResponse(message)
      addMessage("bot", fallbackResponse)
    }
  }

  console.log("Chatbot setup complete")
}

// Fallback responses if Puter.js fails
function getFallbackResponse(message) {
  const msg = message.toLowerCase()

  if (msg.includes("founder") || msg.includes("who founded") || msg.includes("who started")) {
    return "Verse was founded by Ephrata Yohannes, who serves as our Founder & UX Designer."
  }

  if (msg.includes("problem") || msg.includes("solve") || msg.includes("issues")) {
    return "Verse helps people who struggle with expressing difficult emotions. Many find it challenging to articulate feelings like anxiety, depression, or daily stress. We provide a gentle, guided way to write and reflect."
  }

  if (msg.includes("product") || msg.includes("service") || msg.includes("offer")) {
    return "We offer three main products: Verse Focus (for mindful clarity), Verse Journal (for emotional writing and tagging), and Verse Mood (for daily reflection and emotional awareness)."
  }

  if (msg.includes("contact") || msg.includes("reach") || msg.includes("support")) {
    return "You can contact our team through the contact form on our website, via email at ephrata0327@gmail.com, or through our LinkedIn and GitHub profiles linked in the footer."
  }

  if (msg.includes("mission") || msg.includes("vision") || msg.includes("goal")) {
    return "Our mission is to provide a quiet space to feel, reflect, and release — one word at a time. We believe everyone has a story worth telling, and we want to help people express emotions freely and find calm through the power of words."
  }

  return "I'm having trouble connecting to my AI brain right now. Verse is a platform for emotional expression through poetry, helping users find calm and clarity. Please try a more specific question about our story, products, or team."
}

function addMessage(sender, text) {
  console.log("Adding message:", sender, text)

  const chatMessages = document.getElementById("chatMessages")
  if (!chatMessages) {
    console.error("chatMessages not found!")
    return
  }

  const div = document.createElement("div")
  div.className = sender === "user" ? "user-message" : "bot-message"
  div.textContent = text

  chatMessages.appendChild(div)
  chatMessages.scrollTop = chatMessages.scrollHeight
}

// Theme switcher functionality
function setupTheme() {
  console.log("Setting up theme switcher...")

  const themeSwitcher = document.getElementById("themeSwitcher")
  if (!themeSwitcher) {
    console.error("Theme switcher not found!")
    return
  }

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("verse-theme")
  if (savedTheme === "light") {
    document.body.classList.add("light")
    themeSwitcher.checked = true
  }

  // Add event listener for theme toggle
  themeSwitcher.addEventListener("change", function () {
    console.log("Theme changed:", this.checked ? "light" : "dark")
    if (this.checked) {
      document.body.classList.add("light")
      localStorage.setItem("verse-theme", "light")
    } else {
      document.body.classList.remove("light")
      localStorage.setItem("verse-theme", "dark")
    }
  })
}

// FAQ functionality
function setupFAQ() {
  console.log("Setting up FAQ...")

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", function () {
      console.log("FAQ question clicked")
      const faqItem = this.parentElement
      const isOpen = faqItem.classList.contains("open")

      // Close all FAQs
      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("open")
      })

      // Toggle current FAQ
      if (!isOpen) {
        faqItem.classList.add("open")
      }
    })
  })
}

// Back to top button
function setupBackToTop() {
  const backToTop = document.getElementById("backToTop")
  if (!backToTop) {
    console.log("Back to top button not found")
    return
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTop.style.display = "block"
    } else {
      backToTop.style.display = "none"
    }
  })

  backToTop.addEventListener("click", () => {
    console.log("Back to top clicked")
    window.scrollTo({ top: 0, behavior: "smooth" })
  })
}

// Visitor counter
function setupVisitorCounter() {
  const counter = document.getElementById("visitCounter")
  if (!counter) {
    console.log("Visit counter not found")
    return
  }

  let count = localStorage.getItem("verseVisitCount") || 0
  count = Number.parseInt(count) + 1
  localStorage.setItem("verseVisitCount", count)

  counter.textContent = `You've visited ${count} time${count > 1 ? "s" : ""}.`
  console.log("Visit count updated:", count)
}

// Contact form submission
function handleFormSubmit(event) {
  event.preventDefault()
  console.log("Contact form submitted")

  const name = document.getElementById("contactName").value.trim()
  const email = document.getElementById("contactEmail").value.trim()
  const message = document.getElementById("contactMessage").value.trim()

  if (name && email && message) {
    alert("Thank you! We'll get back to you soon.")
    document.getElementById("contactName").value = ""
    document.getElementById("contactEmail").value = ""
    document.getElementById("contactMessage").value = ""
  }
}

// Start flow function
function startFlow() {
  console.log("Start flow clicked")
  alert("Welcome to Verse! Your journey begins now.")
}

// Global error handler
window.addEventListener("error", (e) => {
  console.error("Global error caught:", e.error)
  console.error("Error message:", e.message)
  console.error("Error filename:", e.filename)
  console.error("Error line:", e.lineno)
})

// Check if script is running
console.log("Script.js loaded successfully")
