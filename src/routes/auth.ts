import { Router, Request, Response } from "express";
import userService from "../services/user-services";

const authRoutes = Router();

authRoutes.post("/login", async (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ message: "Credenciais faltando" });

	try {
		const user = await userService.validateCredentials(email, password);
		if (!user) return res.status(401).json({ message: "Email ou senha inválidos" });

		// Regenerar sessão para mitigar session fixation
		req.session.regenerate((err) => {
			if (err) return res.status(500).json({ message: "Erro ao criar sessão" });

			req.session.userId = (user as any).id;
			req.session.save((err2) => {
				if (err2) return res.status(500).json({ message: "Erro ao salvar sessão" });
				// retornar usuário sem senha
				return res.json({ user });
			});
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Erro no servidor" });
	}
});

authRoutes.post("/logout", (req: Request, res: Response) => {
	req.session.destroy((err) => {
		if (err) return res.status(500).json({ message: "Erro ao encerrar sessão" });
		// limpar cookie padrão do express-session
		res.clearCookie("connect.sid");
		return res.json({ message: "Deslogado" });
	});
});

export default authRoutes;