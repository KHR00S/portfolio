import { MotionConfig } from 'framer-motion'
import { About, Builds, Contact, Footer, Hero, Nav, Path, Research } from './components/sections'
import { Credentials } from './components/Credentials'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-lamp focus:px-5 focus:py-3 focus:font-semibold focus:text-on-lamp"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Path />
        <Research />
        <Builds />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
