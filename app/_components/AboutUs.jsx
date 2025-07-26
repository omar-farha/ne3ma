import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import omar from "@/public/Omar.jpg";
import mariam from "@/public/Mariam2.jpg";
import marwan from "@/public/Marwan.jpg";

export function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      id: 1,
      quote:
        "Ne3ma has completely transformed the way we approach web development. Its seamless integration and intuitive design make it a game-changer for any developer.",
      name: "Omar Farha",
      designation: "Web Developer",
      src: omar,
    },
    {
      id: 2,
      quote:
        "From concept to execution, Ne3ma provided us with an outstanding experience. The efficiency and scalability it offers are unmatched in the industry.",
      name: "Mariam Eslam",
      designation: "Web Developer",
      src: mariam,
    },
    // {
    //   id: 3,
    //   quote:
    //     "Ne3ma isn’t just a platform; it’s a revolution. Our business workflow has become more streamlined, saving us both time and resources.",
    //   name: "Marwan Elsabahy",
    //   designation: "Business Developer",
    //   src: marwan,
    // },
    // {
    //   id: 4,
    //   quote:
    //     "I was blown away by the performance and reliability of Ne3ma. It’s rare to find a service that consistently delivers on its promises.",
    //   name: "Kareem",
    //   designation: "Frontend Developer",
    //   src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // },
    // {
    //   id: 5,
    //   quote:
    //     "Ne3ma’s innovative approach has taken our projects to the next level. Whether you’re a startup or an enterprise, this is the solution you need!",
    //   name: "Mohamed Elhadery",
    //   designation: "Frontend Developer",
    //   src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
