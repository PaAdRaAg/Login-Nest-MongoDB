import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwt: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const normalized = email.toLowerCase().trim();
    const exists = await this.userModel.exists({ email: normalized });
    if (exists) throw new BadRequestException('Email ya registrado');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      email: normalized,
      passwordHash,
      failedLoginAttempts: 0,
      lockUntil: null,
    });

    return this.issueToken(user._id.toString(), user.email);
  }

  async login(email: string, password: string) {
    const normalized = email.toLowerCase().trim();
    const user = await this.userModel.findOne({ email: normalized }).exec();
    if (!user) throw new NotFoundException('Email no encontrado');

    const now = new Date();
    if (user.lockUntil && user.lockUntil > now) {
      const seconds = Math.ceil(
        (user.lockUntil.getTime() - now.getTime()) / 1000,
      );
      throw new ForbiddenException(`Cuenta bloqueada. Intenta en ${seconds}s`);
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      const next = (user.failedLoginAttempts ?? 0) + 1;

      if (next >= 3) {
        user.failedLoginAttempts = 3;
        user.lockUntil = new Date(Date.now() + 3 * 60 * 1000);
        await user.save();
        throw new ForbiddenException(
          'Cuenta bloqueada 3 minutos por intentos fallidos',
        );
      }

      user.failedLoginAttempts = next;
      user.lockUntil = undefined;
      await user.save();
      throw new UnauthorizedException('Password incorrecto');
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    return this.issueToken(user._id.toString(), user.email);
  }

  private issueToken(sub: string, email: string) {
    return { token: this.jwt.sign({ sub, email }) };
  }
}
