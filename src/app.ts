import express from "express";
import session from "express-session";
import routes from "./routes";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'biblioteca-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true apenas em HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 24 horas
  }
}));

// Routes
app.use('/api', routes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Biblioteca API está funcionando!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

export { app };