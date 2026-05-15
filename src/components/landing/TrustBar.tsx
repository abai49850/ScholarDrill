import { CheckCircle2, Bot, Library, LineChart } from "lucide-react";

export const TrustBar = () => {
  const features = [
    {
      icon: <CheckCircle2 className="h-5 w-5 text-success" />,
      text: "Australian Curriculum Aligned",
    },
    {
      icon: <Bot className="h-5 w-5 text-primary" />,
      text: "AI Personalised Learning",
    },
    {
      icon: <Library className="h-5 w-5 text-accent" />,
      text: "Thousands of Practice Questions",
    },
    {
      icon: <LineChart className="h-5 w-5 text-orange-500" />,
      text: "Parent Progress Tracking",
    },
  ];

  return (
    <div className="w-full border-y border-border bg-muted/20 py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-background border border-border shadow-sm flex items-center justify-center">
                {feature.icon}
              </div>
              <span className="text-sm md:text-base font-medium text-foreground max-w-[150px]">
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
