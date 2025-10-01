import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PublicNavbar from "@/components/PublicNavbar";
import { useToast } from "@/hooks/use-toast";
import { CLINIC_CONFIG } from "@/config/clinic";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar,
  Send,
  CheckCircle,
  Car,
  Bus,
  Navigation
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: [CLINIC_CONFIG.contact.phone, CLINIC_CONFIG.contact.mobile],
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email",
      details: [CLINIC_CONFIG.contact.email, "appointments@smilecare.com"],
      action: "Send Email"
    },
    {
      icon: MapPin,
      title: "Address",
      details: [CLINIC_CONFIG.address.street, `${CLINIC_CONFIG.address.city}, ${CLINIC_CONFIG.address.state} ${CLINIC_CONFIG.address.postalCode}`],
      action: "Get Directions"
    },
    {
      icon: Clock,
      title: "Hours",
      details: [`Mon-Fri: ${CLINIC_CONFIG.hours.monday}`, `Sat: ${CLINIC_CONFIG.hours.saturday}`, `Sun: ${CLINIC_CONFIG.hours.sunday}`],
      action: "Book Appointment"
    }
  ];

  const officeHours = [
    { day: "Monday", hours: CLINIC_CONFIG.hours.monday },
    { day: "Tuesday", hours: CLINIC_CONFIG.hours.tuesday },
    { day: "Wednesday", hours: CLINIC_CONFIG.hours.wednesday },
    { day: "Thursday", hours: CLINIC_CONFIG.hours.thursday },
    { day: "Friday", hours: CLINIC_CONFIG.hours.friday },
    { day: "Saturday", hours: CLINIC_CONFIG.hours.saturday },
    { day: "Sunday", hours: CLINIC_CONFIG.hours.sunday }
  ];

  const directions = [
    {
      icon: Car,
      title: "By Car",
      description: "Free parking available in our lot. Enter from Main Street."
    },
    {
      icon: Bus,
      title: "Public Transit",
      description: "Bus routes 15, 22, and 45 stop within 2 blocks of our office."
    },
    {
      icon: Navigation,
      title: "GPS Coordinates",
      description: "40.7128° N, 74.0060° W"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-slide-up">
            Get in touch with our friendly team. We're here to help with all your dental care needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <NavLink to="/book-appointment">
              <Button size="lg" variant="hero">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>
            </NavLink>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Phone className="w-5 h-5 mr-2" />
              Call (555) 123-4567
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 px-4 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="shadow-elegant hover:shadow-card transition-smooth">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">{detail}</p>
                    ))}
                    <Button variant="outline" size="sm" className="mt-4">
                      {info.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div>
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What is this regarding?"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Please describe how we can help you..."
                        className="min-h-[120px]"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      variant="medical"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Office Hours & Directions */}
            <div className="space-y-8">
              
              {/* Office Hours */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    Office Hours
                  </CardTitle>
                  <CardDescription>
                    We're here when you need us most
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {officeHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <span className="font-medium text-foreground">{schedule.day}</span>
                        <span className="text-muted-foreground">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-center text-primary mb-2">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="font-medium">Emergency Services</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      24/7 emergency dental care available. Call our emergency line for urgent situations.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Directions */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Navigation className="w-5 h-5 mr-2 text-primary" />
                    Getting Here
                  </CardTitle>
                  <CardDescription>
                    Easy access and convenient parking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {directions.map((direction, index) => {
                      const Icon = direction.icon;
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{direction.title}</h4>
                            <p className="text-sm text-muted-foreground">{direction.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-16 px-4 gradient-soft">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Find Us</h2>
            <p className="text-lg text-muted-foreground">
              Located in the heart of Healthcare City with easy access and parking.
            </p>
          </div>
          
          <Card className="shadow-elegant overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              {/* Google Maps Embed Placeholder */}
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Interactive Map</h3>
                <p className="text-muted-foreground mb-4">
                  123 Dental Street, Healthcare City, HC 12345
                </p>
                <Button variant="outline">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>
              {/* 
              To add actual Google Maps, replace this div with:
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878459418!3d40.74844097932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              */}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="shadow-elegant gradient-soft">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">Ready to Schedule Your Visit?</CardTitle>
              <CardDescription className="text-lg">
                Don't wait - take the first step towards better oral health today.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NavLink to="/book-appointment">
                  <Button size="lg" variant="medical">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Online
                  </Button>
                </NavLink>
                <Button size="lg" variant="outline">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (555) 123-4567
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                New patients welcome • Same-day appointments available • Insurance accepted
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
