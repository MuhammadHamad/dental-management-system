import heroImage from "@/assets/dental-hero.jpg";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PublicNavbar from "@/components/PublicNavbar";
import { 
  Calendar, 
  Shield, 
  Clock, 
  Award, 
  Phone, 
  MapPin, 
  Star,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Schedule appointments online 24/7 with our simple booking system"
    },
    {
      icon: Shield,
      title: "Safe & Clean",
      description: "State-of-the-art sterilization and safety protocols for your protection"
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Evening and weekend appointments available to fit your schedule"
    },
    {
      icon: Award,
      title: "Expert Care",
      description: "Licensed professionals with years of experience in dental care"
    }
  ];

  const services = [
    {
      title: "General Dentistry",
      description: "Comprehensive dental care including cleanings, fillings, and preventive treatments",
      price: "Starting at $150"
    },
    {
      title: "Cosmetic Dentistry",
      description: "Teeth whitening, veneers, and smile makeovers to enhance your appearance",
      price: "Starting at $300"
    },
    {
      title: "Orthodontics",
      description: "Braces and aligners to straighten teeth and improve bite alignment",
      price: "Starting at $2,500"
    },
    {
      title: "Oral Surgery",
      description: "Tooth extractions, implants, and other surgical dental procedures",
      price: "Starting at $500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section 
        className="relative gradient-hero text-white py-20 px-4 bg-cover bg-center bg-blend-overlay"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-primary/80"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Your Smile is Our Priority
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-slide-up">
            Modern dental care with cutting-edge technology and compassionate service. 
            Experience the difference at DentalCare Pro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Button size="lg" variant="hero">
              <Calendar className="w-5 h-5 mr-2" />
              Book Appointment
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Phone className="w-5 h-5 mr-2" />
              Call (555) 123-4567
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose DentalCare Pro?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine advanced dental technology with personalized care to give you the best possible experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 gradient-soft">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive dental care tailored to your needs, from routine cleanings to complex procedures.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </div>
                    <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-primary">{service.price}</span>
                    <Button variant="outline" size="sm">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Contact us today to schedule your appointment. Our friendly staff is here to help you achieve your best smile.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-primary" />
                  <span className="text-lg">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <span className="text-lg">123 Dental Street, Healthcare City, HC 12345</span>
                </div>
              </div>
            </div>
            
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Book Your Appointment</CardTitle>
                <CardDescription className="text-center">
                  Schedule your visit online and we'll confirm your appointment within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button size="lg" variant="medical" className="w-full">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Appointment
                </Button>
                <div className="text-center">
                  <div className="flex justify-center items-center space-x-1 text-sm text-muted-foreground">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2">4.9/5 from 200+ patients</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-semibold text-foreground">DentalCare Pro</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Professional dental care with modern technology and compassionate service.
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 DentalCare Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}