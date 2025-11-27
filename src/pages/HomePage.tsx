import React from 'react';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold">Welcome to your Lovable project</h1>
      <p className="mt-4 text-lg text-muted-foreground">Let's build something amazing together!</p>
    </div>
  );
};

export default HomePage;