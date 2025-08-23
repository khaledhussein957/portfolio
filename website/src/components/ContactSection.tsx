import { Calendar } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="w-full py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <footer className="rounded-2xl text-card-foreground shadow-lg dark:shadow-[0_2px_16px_0_rgba(0,0,0,0.7)] p-10">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight">
              Download My CV
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Grab a copy of my latest CV and learn more about my skills and
              experience.
            </p>
            <a
                href="/src/CV/Khaled_Hussein_FullStack_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors px-5 py-2.5 font-medium text-sm w-full sm:w-auto mx-auto md:mx-0"
            >
              Download CV
            </a>
          </div>

          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Khaled Hussein Siid. All rights
              reserved.
            </p>
            <p className="mt-1 flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              Last updated: August 21, 2025
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default ContactSection;
