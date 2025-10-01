import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import PublicNavbar from "@/components/PublicNavbar";
import { CLINIC_CONFIG } from "@/config/clinic";
import { 
  Smile, 
  Shield, 
  Zap, 
  Heart, 
  Star,
  Clock,
  Award,
  CheckCircle,
  ArrowRight,
  Calendar
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Services() {
  const services = [
    {
      id: 1,
      title: "General Dentistry",
      description: "Comprehensive oral health care including routine cleanings, fillings, and preventive treatments to maintain your dental health.",
      icon: Shield,
      price: "Starting at $150",
      duration: "45-60 minutes",
      features: [
        "Regular checkups and cleanings",
        "Cavity detection and fillings",
        "Fluoride treatments",
        "Oral cancer screening",
        "Dental X-rays"
      ],
      popular: false
    },
    {
      id: 2,
      title: "Cosmetic Dentistry",
      description: "Transform your smile with our advanced cosmetic procedures designed to enhance your appearance and boost confidence.",
      icon: Smile,
      price: "Starting at $300",
      duration: "60-90 minutes",
      features: [
        "Professional teeth whitening",
        "Porcelain veneers",
        "Dental bonding",
        "Smile makeovers",
        "Gum contouring"
      ],
      popular: true
    },
    {
      id: 3,
      title: "Orthodontics",
      description: "Straighten your teeth and improve your bite with our modern orthodontic solutions including traditional and clear braces.",
      icon: Zap,
      price: "Starting at $2,500",
      duration: "12-24 months",
      features: [
        "Traditional metal braces",
        "Clear ceramic braces",
        "Invisalign clear aligners",
        "Retainers and maintenance",
        "Bite correction"
      ],
      popular: false
    },
    {
      id: 4,
      title: "Oral Surgery",
      description: "Expert surgical procedures performed with precision and care, including extractions, implants, and corrective surgery.",
      icon: Heart,
      price: "Starting at $500",
      duration: "30-120 minutes",
      features: [
        "Tooth extractions",
        "Dental implants",
        "Wisdom tooth removal",
        "Bone grafting",
        "TMJ treatment"
      ],
      popular: false
    },
    {
      id: 5,
      title: "Pediatric Dentistry",
      description: "Specialized dental care for children and teens in a comfortable, kid-friendly environment with gentle techniques.",
      icon: Star,
      price: "Starting at $120",
      duration: "30-45 minutes",
      features: [
        "Child-friendly examinations",
        "Preventive care and education",
        "Fluoride treatments",
        "Dental sealants",
        "Early orthodontic evaluation"
      ],
      popular: false
    },
    {
      id: 6,
      title: "Emergency Dental Care",
      description: "Immediate relief for dental emergencies with same-day appointments and urgent care services when you need them most.",
      icon: Clock,
      price: "Starting at $200",
      duration: "30-60 minutes",
      features: [
        "Same-day appointments",
        "Pain relief treatment",
        "Emergency extractions",
        "Broken tooth repair",
        "24/7 on-call service"
      ],
      popular: false
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: "Expert Care",
      description: "Board-certified dentists with years of experience"
    },
    {
      icon: Shield,
      title: "Advanced Technology",
      description: "State-of-the-art equipment and modern techniques"
    },
    {
      icon: Heart,
      title: "Comfortable Experience",
      description: "Relaxing environment with sedation options available"
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Evening and weekend appointments available"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Our Dental Services
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-slide-up">
            Comprehensive dental care tailored to your needs, from routine cleanings to advanced treatments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <NavLink to="/book-appointment">
              <Button size="lg" variant="hero">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>
            </NavLink>
            <NavLink to="/contact">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Get Consultation
              </Button>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Complete Dental Care Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From preventive care to advanced treatments, we offer comprehensive dental services to keep your smile healthy and beautiful.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className={`shadow-card hover:shadow-elegant transition-smooth relative ${service.popular ? 'ring-2 ring-primary' : ''}`}>
                  {service.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-primary">{service.price}</span>
                      <span className="text-sm text-muted-foreground">{service.duration}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">What's Included:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4">
                      <NavLink to="/book-appointment" className="w-full">
                        <Button variant="outline" className="w-full">
                          Book This Service
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </NavLink>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 gradient-soft">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose DentalCare Pro?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing exceptional dental care with the latest technology and personalized attention.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth text-center">
                  <CardHeader>
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="shadow-elegant gradient-soft">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">Ready to Transform Your Smile?</CardTitle>
              <CardDescription className="text-lg">
                Schedule your consultation today and take the first step towards optimal oral health.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NavLink to="/book-appointment">
                  <Button size="lg" variant="medical">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Appointment
                  </Button>
                </NavLink>
                <NavLink to="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
                  </Button>
                </NavLink>
              </div>
              <div className="flex justify-center items-center space-x-1 text-sm text-muted-foreground">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2">4.9/5 from 200+ patients</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
