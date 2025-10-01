import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import PublicNavbar from "@/components/PublicNavbar";
import { CLINIC_CONFIG } from "@/config/clinic";
import { 
  Award, 
  Users, 
  Heart, 
  Shield, 
  Star,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Stethoscope,
  CheckCircle
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function About() {
  const dentists = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      title: "Lead Dentist & Practice Owner",
      specialization: "General & Cosmetic Dentistry",
      experience: "15+ years",
      education: [
        "DDS, Harvard School of Dental Medicine",
        "Residency in General Dentistry, Mass General",
        "Advanced Cosmetic Dentistry Certification"
      ],
      bio: "Dr. Johnson is passionate about creating beautiful, healthy smiles. She combines the latest dental technology with a gentle, patient-centered approach to provide exceptional care.",
      image: "/api/placeholder/300/400",
      achievements: [
        "Top Dentist Award 2023",
        "Excellence in Patient Care",
        "Advanced Implant Certification"
      ]
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      title: "Orthodontist",
      specialization: "Orthodontics & Invisalign",
      experience: "12+ years",
      education: [
        "DDS, University of California San Francisco",
        "MS in Orthodontics, UCLA",
        "Invisalign Diamond Provider"
      ],
      bio: "Dr. Chen specializes in creating perfect smiles through advanced orthodontic treatments. He's known for his precision and attention to detail in complex cases.",
      image: "/api/placeholder/300/400",
      achievements: [
        "Invisalign Diamond Provider",
        "Best Orthodontist 2022",
        "Research in Digital Orthodontics"
      ]
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      title: "Pediatric Dentist",
      specialization: "Pediatric & Family Dentistry",
      experience: "10+ years",
      education: [
        "DDS, Columbia University",
        "Pediatric Dentistry Residency, Children's Hospital",
        "Sedation Dentistry Certification"
      ],
      bio: "Dr. Rodriguez creates a fun, comfortable environment for children while providing comprehensive dental care. She's dedicated to making dental visits positive experiences.",
      image: "/api/placeholder/300/400",
      achievements: [
        "Pediatric Excellence Award",
        "Child-Friendly Practice Certification",
        "Community Service Recognition"
      ]
    }
  ];

  const stats = [
    {
      number: "15+",
      label: "Years of Excellence",
      icon: Award
    },
    {
      number: "5,000+",
      label: "Happy Patients",
      icon: Users
    },
    {
      number: "98%",
      label: "Patient Satisfaction",
      icon: Heart
    },
    {
      number: "24/7",
      label: "Emergency Care",
      icon: Shield
    }
  ];

  const values = [
    {
      title: "Patient-Centered Care",
      description: "Every treatment plan is tailored to your unique needs and goals.",
      icon: Heart
    },
    {
      title: "Advanced Technology",
      description: "We use the latest dental technology for precise, comfortable treatments.",
      icon: Shield
    },
    {
      title: "Continuous Education",
      description: "Our team stays current with the latest techniques and best practices.",
      icon: GraduationCap
    },
    {
      title: "Comprehensive Care",
      description: "From preventive care to complex procedures, we handle it all.",
      icon: Stethoscope
    }
  ];

  const timeline = [
    {
      year: "2008",
      title: "Practice Founded",
      description: "Dr. Johnson established DentalCare Pro with a vision of exceptional patient care."
    },
    {
      year: "2012",
      title: "Expansion & Growth",
      description: "Added advanced cosmetic dentistry services and state-of-the-art equipment."
    },
    {
      year: "2016",
      title: "Team Expansion",
      description: "Welcomed Dr. Chen and Dr. Rodriguez to provide specialized care."
    },
    {
      year: "2020",
      title: "Digital Innovation",
      description: "Implemented digital workflows and telemedicine capabilities."
    },
    {
      year: "2024",
      title: "Award Recognition",
      description: "Recognized as the top dental practice in the region for patient satisfaction."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            About DentalCare Pro
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-slide-up">
            Dedicated to providing exceptional dental care with compassion, expertise, and the latest technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <NavLink to="/book-appointment">
              <Button size="lg" variant="hero">
                <Calendar className="w-5 h-5 mr-2" />
                Meet Our Team
              </Button>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="shadow-elegant text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                At DentalCare Pro, we believe everyone deserves a healthy, beautiful smile. Our mission is to provide 
                comprehensive, compassionate dental care using the latest technology and techniques in a comfortable, 
                welcoming environment.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                We're committed to building long-term relationships with our patients, focusing on preventive care 
                and education to help you maintain optimal oral health for life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <NavLink to="/services">
                  <Button variant="medical">
                    Our Services
                  </Button>
                </NavLink>
                <NavLink to="/contact">
                  <Button variant="outline">
                    Contact Us
                  </Button>
                </NavLink>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Heart className="w-24 h-24 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">Caring for Smiles</h3>
                  <p className="text-muted-foreground">Since 2008</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 gradient-soft">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at DentalCare Pro.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth text-center">
                  <CardHeader>
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our experienced dentists are committed to providing you with the highest quality care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {dentists.map((dentist) => (
              <Card key={dentist.id} className="shadow-card hover:shadow-elegant transition-smooth">
                <CardHeader className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-16 h-16 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{dentist.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {dentist.title}
                  </CardDescription>
                  <Badge variant="secondary" className="mx-auto">
                    {dentist.specialization}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{dentist.experience} experience</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    {dentist.bio}
                  </p>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Education:</h4>
                    <ul className="space-y-1">
                      {dentist.education.map((edu, index) => (
                        <li key={index} className="flex items-start text-xs text-muted-foreground">
                          <GraduationCap className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Achievements:</h4>
                    <ul className="space-y-1">
                      {dentist.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start text-xs text-muted-foreground">
                          <Award className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0 text-yellow-500" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 gradient-soft">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              A timeline of growth, innovation, and commitment to excellence.
            </p>
          </div>
          
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{item.year}</span>
                  </div>
                </div>
                <Card className="flex-1 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="shadow-elegant gradient-soft">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">Experience the DentalCare Pro Difference</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of satisfied patients who trust us with their oral health.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NavLink to="/book-appointment">
                  <Button size="lg" variant="medical">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Consultation
                  </Button>
                </NavLink>
                <NavLink to="/contact">
                  <Button size="lg" variant="outline">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Us Today
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
