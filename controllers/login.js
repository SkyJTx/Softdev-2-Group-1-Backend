import { signToken } from "./token/token.js";
import bcrypt from "bcryptjs";
import supabase from "./database/database.js";


export const loginController = async (req, res) => {
    const { emailorusername, password } = req.body;
    const { data, error } = await supabase
        .from('user_info')
        .select('*')
        .or(`email.eq.${emailorusername},username.eq.${emailorusername}`);
    if (error) throw error;
    else {
        if (data.length === 0) {
            res.status(400).json({ error: true, message: "user does not exist" });
        }
        else {
            const user = data[0];
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                const token = signToken(user.id, user.email);
                res.status(200).json({ token: token });
            }
            else {
                res.status(400).json({ error: true, message: "invalid password" });
            }
        }
    }
}