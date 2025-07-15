import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Code, 
  Smartphone, 
  Globe, 
  Database, 
  Shield, 
  Zap,
  Users,
  Award,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Star
} from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'portfolio', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TechSoft</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'services', 'portfolio', 'about', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize font-medium transition-colors ${
                    activeSection === item 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item === 'home' ? 'Trang chủ' : 
                   item === 'services' ? 'Dịch vụ' :
                   item === 'portfolio' ? 'Dự án' :
                   item === 'about' ? 'Giới thiệu' : 'Liên hệ'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {['home', 'services', 'portfolio', 'about', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors capitalize"
                >
                  {item === 'home' ? 'Trang chủ' : 
                   item === 'services' ? 'Dịch vụ' :
                   item === 'portfolio' ? 'Dự án' :
                   item === 'about' ? 'Giới thiệu' : 'Liên hệ'}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Giải pháp
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    {" "}phần mềm{" "}
                  </span>
                  chuyên nghiệp
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Chúng tôi phát triển các ứng dụng web, mobile và hệ thống phần mềm tùy chỉnh 
                  giúp doanh nghiệp của bạn tăng trưởng và tối ưu hóa quy trình làm việc.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                >
                  Bắt đầu dự án <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scrollToSection('portfolio')}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Xem dự án <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">50+</div>
                  <div className="text-gray-600">Dự án hoàn thành</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">5+</div>
                  <div className="text-gray-600">Năm kinh nghiệm</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">100%</div>
                  <div className="text-gray-600">Khách hàng hài lòng</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-blue-100 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-4 bg-blue-100 rounded w-2/3"></div>
                    <div className="h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-16 bg-gray-100 rounded"></div>
                      <div className="h-16 bg-blue-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Dịch vụ của chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp đầy đủ các dịch vụ phát triển phần mềm từ ý tưởng đến triển khai
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Phát triển Web",
                description: "Xây dựng website và ứng dụng web hiện đại với các công nghệ mới nhất như React, Node.js, và nhiều framework khác.",
                features: ["Responsive Design", "SEO Optimized", "Fast Loading"]
              },
              {
                icon: Smartphone,
                title: "Ứng dụng Mobile",
                description: "Phát triển app mobile cho iOS và Android với trải nghiệm người dùng tuyệt vời và hiệu suất cao.",
                features: ["Cross Platform", "Native Performance", "App Store Ready"]
              },
              {
                icon: Database,
                title: "Hệ thống Backend",
                description: "Thiết kế và phát triển hệ thống backend mạnh mẽ, bảo mật và có khả năng mở rộng cao.",
                features: ["API Development", "Database Design", "Cloud Integration"]
              },
              {
                icon: Shield,
                title: "Bảo mật hệ thống",
                description: "Đảm bảo an toàn thông tin và dữ liệu với các giải pháp bảo mật tiên tiến và kiểm tra bảo mật định kỳ.",
                features: ["Security Audit", "Data Protection", "Compliance"]
              },
              {
                icon: Zap,
                title: "Tối ưu hiệu suất",
                description: "Tối ưu hóa hiệu suất ứng dụng để đảm bảo tốc độ tải nhanh và trải nghiệm người dùng mượt mà.",
                features: ["Performance Monitoring", "Code Optimization", "CDN Setup"]
              },
              {
                icon: Users,
                title: "Tư vấn công nghệ",
                description: "Đội ngũ chuyên gia tư vấn giải pháp công nghệ phù hợp nhất cho nhu cầu và ngân sách của doanh nghiệp.",
                features: ["Technology Assessment", "Solution Architecture", "Digital Strategy"]
              }
            ].map((service, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                    <service.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                </div>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Dự án tiêu biểu
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Một số dự án nổi bật mà chúng tôi đã thực hiện thành công cho khách hàng
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Hệ thống ERP doanh nghiệp",
                category: "Web Application",
                description: "Phát triển hệ thống quản lý tài nguyên doanh nghiệp tích hợp đầy đủ các module từ kế toán đến nhân sự.",
                image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
                tech: ["React", "Node.js", "PostgreSQL"]
              },
              {
                title: "App thương mại điện tử",
                category: "Mobile App",
                description: "Ứng dụng mua sắm trực tuyến với giao diện đẹp mắt và tính năng thanh toán an toàn.",
                image: "https://images.pexels.com/photos/4050418/pexels-photo-4050418.jpeg",
                tech: ["React Native", "Firebase", "Stripe"]
              },
              {
                title: "Platform học trực tuyến",
                category: "Web Platform",
                description: "Nền tảng giáo dục trực tuyến với tính năng video streaming và quản lý khóa học.",
                image: "https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg",
                tech: ["Vue.js", "Express", "MongoDB"]
              },
              {
                title: "Hệ thống IoT monitoring",
                category: "IoT System",
                description: "Giải pháp giám sát và điều khiển thiết bị IoT trong nhà máy sản xuất.",
                image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg",
                tech: ["Python", "InfluxDB", "Grafana"]
              },
              {
                title: "App quản lý tài chính",
                category: "Fintech App",
                description: "Ứng dụng quản lý tài chính cá nhân với AI phân tích chi tiêu thông minh.",
                image: "https://images.pexels.com/photos/259132/pexels-photo-259132.jpeg",
                tech: ["Flutter", "TensorFlow", "Cloud ML"]
              },
              {
                title: "Website bất động sản",
                category: "Real Estate Portal",
                description: "Portal bất động sản với tính năng tìm kiếm thông minh và virtual tour.",
                image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
                tech: ["Next.js", "Prisma", "AWS"]
              }
            ].map((project, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/10 transition-colors duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-blue-600 text-sm font-medium">{project.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Về TechSoft
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Với hơn 5 năm kinh nghiệm trong lĩnh vực phát triển phần mềm, TechSoft tự hào là 
                  đối tác tin cậy của nhiều doanh nghiệp trong việc số hóa và tối ưu hóa quy trình kinh doanh.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Đội ngũ chuyên gia của chúng tôi luôn cập nhật những công nghệ mới nhất và áp dụng 
                  các phương pháp phát triển hiện đại để mang lại giải pháp tối ưu cho khách hàng.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900">ISO 27001</div>
                  <div className="text-gray-600">Chứng nhận bảo mật</div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900">20+</div>
                  <div className="text-gray-600">Chuyên gia IT</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tầm nhìn</h3>
                <p className="text-gray-600">
                  Trở thành công ty phát triển phần mềm hàng đầu Việt Nam, mang lại giá trị 
                  thực cho khách hàng thông qua các giải pháp công nghệ sáng tạo.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sứ mệnh</h3>
                <p className="text-gray-600">
                  Giúp các doanh nghiệp chuyển đổi số thành công, tối ưu hóa quy trình và 
                  nâng cao hiệu quả kinh doanh thông qua công nghệ.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-8">
                <h3 className="text-xl font-bold mb-4">Giá trị cốt lõi</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    Chất lượng là ưu tiên hàng đầu
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    Đổi mới và sáng tạo liên tục
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    Đặt khách hàng làm trung tâm
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Nguyễn Văn A",
                position: "CEO, Tech Startup",
                content: "TechSoft đã giúp chúng tôi phát triển MVP trong thời gian kỷ lục. Chất lượng code rất tốt và support tận tình.",
                rating: 5
              },
              {
                name: "Trần Thị B",
                position: "CTO, E-commerce Company",
                content: "Hệ thống họ phát triển rất ổn định và bảo mật. Sau 2 năm vận hành chưa gặp vấn đề gì nghiêm trọng.",
                rating: 5
              },
              {
                name: "Lê Minh C",
                position: "Founder, EdTech Platform",
                content: "Đội ngũ có kinh nghiệm và hiểu rõ yêu cầu. Luôn đưa ra những gợi ý hữu ích để cải thiện sản phẩm.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.position}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sẵn sàng biến ý tưởng của bạn thành hiện thực? Hãy liên hệ ngay để được tư vấn miễn phí
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Thông tin liên hệ</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Điện thoại</div>
                      <div className="text-gray-600">+84 123 456 789</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Email</div>
                      <div className="text-gray-600">contact@techsoft.vn</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Địa chỉ</div>
                      <div className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-8">
                <h4 className="text-xl font-bold mb-4">Tư vấn miễn phí</h4>
                <p className="mb-4">
                  Đặt lịch tư vấn miễn phí với chuyên gia của chúng tôi để thảo luận về dự án của bạn.
                </p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Đặt lịch ngay
                </button>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="+84 123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dịch vụ quan tâm
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all">
                  <option>Chọn dịch vụ</option>
                  <option>Phát triển Web</option>
                  <option>Ứng dụng Mobile</option>
                  <option>Hệ thống Backend</option>
                  <option>Tư vấn công nghệ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả dự án *
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="Mô tả chi tiết về dự án của bạn..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg"
              >
                Gửi yêu cầu tư vấn
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TechSoft</span>
              </div>
              <p className="text-gray-400">
                Đối tác tin cậy trong hành trình chuyển đổi số của doanh nghiệp bạn.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Dịch vụ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Phát triển Web</li>
                <li>Ứng dụng Mobile</li>
                <li>Hệ thống Backend</li>
                <li>Tư vấn công nghệ</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Công ty</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Giới thiệu</li>
                <li>Đội ngũ</li>
                <li>Tuyển dụng</li>
                <li>Tin tức</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+84 123 456 789</li>
                <li>contact@techsoft.vn</li>
                <li>123 Đường ABC, Quận 1, TP.HCM</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TechSoft. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;