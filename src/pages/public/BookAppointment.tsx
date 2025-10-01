import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import PublicNavbar from "@/components/PublicNavbar";
import { DentalAnimatedBackground } from "@/components/DentalAnimatedBackground";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CLINIC_CONFIG, DEFAULT_TREATMENTS } from "@/config/clinic";
import { format, addDays, isWeekend, isBefore, startOfDay } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function BookAppointment() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    service: '',
    preferredTime: '',
    isNewPatient: 'yes',
    insuranceProvider: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    reasonForVisit: '',
    additionalNotes: ''
  });

  // Generate time slots for a day
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 8; // 8 AM
    const endHour = 17; // 5 PM
    const slotDuration = 30; // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time,
          available: Math.random() > 0.3 // Simulate availability
        });
      }
    }
    return slots;
  };

  // Load available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      // Simulate API call to get available slots
      setTimeout(() => {
        setAvailableSlots(generateTimeSlots());
        setLoadingSlots(false);
      }, 500);
    }
  }, [selectedDate]);

  const services = [
    { value: "general-checkup", label: "General Checkup & Cleaning" },
    { value: "cosmetic-consultation", label: "Cosmetic Consultation" },
    { value: "orthodontic-consultation", label: "Orthodontic Consultation" },
    { value: "emergency", label: "Emergency Appointment" },
    { value: "teeth-whitening", label: "Teeth Whitening" },
    { value: "dental-implant", label: "Dental Implant Consultation" },
    { value: "root-canal", label: "Root Canal Treatment" },
    { value: "extraction", label: "Tooth Extraction" },
    { value: "pediatric", label: "Pediatric Dental Care" },
    { value: "other", label: "Other (specify in notes)" }
  ];

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select both a date and time for your appointment."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Check if patient exists or create new patient record
      let patientId = null;
      
      // Check if patient already exists by email
      const { data: existingPatients } = await supabase
        .from('patients')
        .select('id')
        .eq('email', formData.email)
        .limit(1);

      if (existingPatients && existingPatients.length > 0) {
        patientId = existingPatients[0].id;
      } else {
        // Create new patient record
        const patientNumber = `P${Date.now()}`; // Generate unique patient number
        const { data: newPatient, error: patientError } = await supabase
          .from('patients')
          .insert({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            date_of_birth: formData.dateOfBirth || null,
            medical_history: formData.medicalHistory || null,
            allergies: formData.allergies || null,
            clinic_id: CLINIC_CONFIG.id,
            patient_number: patientNumber
          })
          .select('id')
          .single();

        if (patientError) {
          console.error('Error creating patient:', patientError);
          throw new Error('Failed to create patient record');
        }

        patientId = newPatient.id;
      }

      // Step 2: Create appointment with patient_id
      const appointmentNotes = [
        formData.service && `Service: ${formData.service}`,
        formData.reasonForVisit && `Reason: ${formData.reasonForVisit}`,
        formData.additionalNotes && `Notes: ${formData.additionalNotes}`
      ].filter(Boolean).join(' | ');

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          clinic_id: CLINIC_CONFIG.id,
          patient_id: patientId,
          appointment_date: format(selectedDate, 'yyyy-MM-dd'),
          appointment_time: selectedTime,
          status: 'scheduled',
          notes: appointmentNotes || null
        })
        .select();

      if (error) {
        console.error('Error saving appointment:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        toast({
          variant: "destructive",
          title: "Database Error",
          description: error.message || "Failed to save appointment. Please try again or contact support."
        });
        throw error;
      }

      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been successfully scheduled. We'll send you a confirmation email shortly."
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        service: '',
        preferredTime: '',
        isNewPatient: 'yes',
        insuranceProvider: '',
        emergencyContact: '',
        emergencyPhone: '',
        medicalHistory: '',
        allergies: '',
        currentMedications: '',
        reasonForVisit: '',
        additionalNotes: ''
      });
      setSelectedDate(undefined);
      setSelectedTime("");

    } catch (error: any) {
      console.error('Error submitting appointment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "There was a problem submitting your appointment request. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return isBefore(date, today) || isWeekend(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      
      {/* Hero Section - Exactly 100vh including navbar */}
      <section className="relative h-screen flex items-center justify-center gradient-hero text-white px-4 overflow-hidden" style={{height: 'calc(100vh - 64px)'}}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80"></div>
        
        {/* Dental Animated Background */}
        <DentalAnimatedBackground />
        
        {/* Enhanced background elements for depth */}
        <div className="absolute inset-0 z-5">
          <div className="absolute top-10 right-20 w-20 h-20 bg-white/3 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-10 left-20 w-16 h-16 bg-white/2 rounded-full blur-xl animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        {/* Text overlay for maximum readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-black/5 z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-30 px-4">
          <Badge className="mb-6 bg-white/25 text-white border-white/40 animate-fade-in backdrop-blur-md shadow-lg text-sm px-4 py-2">
            📅 Easy Online Booking
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in leading-tight">
            <span className="bg-gradient-to-r from-white via-white to-blue-50 bg-clip-text text-transparent drop-shadow-xl filter brightness-110">
              Book Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-50 via-white to-white bg-clip-text text-transparent drop-shadow-xl filter brightness-110">
              Appointment
            </span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-white max-w-3xl mx-auto animate-slide-up leading-relaxed font-medium drop-shadow-lg filter brightness-110">
            Schedule your visit with our expert dental team. We'll take great care of your smile 
            and ensure you have the best possible experience.
          </p>
          
          {/* Trust indicators with enhanced visibility */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-white animate-fade-in backdrop-blur-md bg-white/10 rounded-2xl p-4 md:p-6 border border-white/20 shadow-xl" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 drop-shadow-lg" />
              <span className="text-sm md:text-base font-semibold drop-shadow-lg">Same Day</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 drop-shadow-lg" />
              <span className="text-sm md:text-base font-semibold drop-shadow-lg">Flexible</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 drop-shadow-lg" />
              <span className="text-sm md:text-base font-semibold drop-shadow-lg">Expert Care</span>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Form */}
      <section className="py-20 px-4 bg-background relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="gradient-card shadow-2xl border-0 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
                Schedule Your Visit
              </CardTitle>
              <CardDescription className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Fill out the form below and we'll confirm your appointment within 24 hours. 
                Our team is ready to provide you with exceptional dental care.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        required
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        required
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        required
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="isNewPatient">Are you a new patient? *</Label>
                      <Select value={formData.isNewPatient} onValueChange={(value) => handleChange('isNewPatient', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes, I'm a new patient</SelectItem>
                          <SelectItem value="no">No, I'm an existing patient</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                    Appointment Details
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service">Service Needed *</Label>
                    <Select value={formData.service} onValueChange={(value) => handleChange('service', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service..." />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            {service.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Preferred Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={isDateDisabled}
                            initialFocus
                            fromDate={new Date()}
                            toDate={addDays(new Date(), 90)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Preferred Time *</Label>
                      <Select 
                        value={selectedTime} 
                        onValueChange={setSelectedTime}
                        disabled={!selectedDate}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={selectedDate ? "Select time..." : "Select date first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingSlots ? (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Loading available times...
                            </div>
                          ) : (
                            availableSlots.map((slot) => (
                              <SelectItem 
                                key={slot.time} 
                                value={slot.time}
                                disabled={!slot.available}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span>{slot.time}</span>
                                  {!slot.available && (
                                    <Badge variant="secondary" className="ml-2">Booked</Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reasonForVisit">Reason for Visit *</Label>
                    <Textarea
                      id="reasonForVisit"
                      value={formData.reasonForVisit}
                      onChange={(e) => handleChange('reasonForVisit', e.target.value)}
                      required
                      placeholder="Please describe the reason for your visit..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-primary" />
                    Medical Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                    <Input
                      id="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={(e) => handleChange('insuranceProvider', e.target.value)}
                      placeholder="e.g., Blue Cross Blue Shield, Aetna, etc."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleChange('emergencyContact', e.target.value)}
                        placeholder="Full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={(e) => handleChange('medicalHistory', e.target.value)}
                      placeholder="Please list any relevant medical conditions, surgeries, or treatments..."
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => handleChange('allergies', e.target.value)}
                      placeholder="Please list any allergies to medications, materials, or foods..."
                      className="min-h-[60px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentMedications">Current Medications</Label>
                    <Textarea
                      id="currentMedications"
                      value={formData.currentMedications}
                      onChange={(e) => handleChange('currentMedications', e.target.value)}
                      placeholder="Please list all medications you're currently taking..."
                      className="min-h-[60px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => handleChange('additionalNotes', e.target.value)}
                      placeholder="Any additional information you'd like us to know..."
                      className="min-h-[60px]"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-border">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>
                        By submitting this form, you agree to our terms and conditions. We'll contact you within 24 hours to confirm your appointment. For urgent matters, please call us directly at (555) 123-4567.
                      </p>
                    </div>
                    
                    <Button 
                      type="submit" 
                      size="lg" 
                      variant="medical" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Submitting Request...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Request Appointment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4 gradient-soft">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Need Help or Have Questions?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-card">
              <CardContent className="pt-6 text-center">
                <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-sm text-muted-foreground">(555) 123-4567</p>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="pt-6 text-center">
                <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-sm text-muted-foreground">appointments@dentalcarepro.com</p>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="pt-6 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Office Hours</h3>
                <p className="text-sm text-muted-foreground">Mon-Fri: 8AM-6PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
