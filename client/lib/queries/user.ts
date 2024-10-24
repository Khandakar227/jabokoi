import { hashPassword } from "../auth";
import User from "@/lib/models/user"

export const createUser = async (data:{ name:string, password: string, email: string }) => {
    const user = await User.findOne({email: data.email});
    if(user) throw new Error('User already exist');
    const password = hashPassword(data.password);
    await User.create({...data, password});
}
