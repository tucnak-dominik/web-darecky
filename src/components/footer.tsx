export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
      Made with <span aria-label="láska">❤️</span> by Dominik ·{' '}
      {new Date().getFullYear()}
    </footer>
  );
}
