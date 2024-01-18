import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();

    const accessToken = req.headers.accesstoken as string;
    const refreshToken = req.headers.refreshtoken as string;


      if (!accessToken || !refreshToken) {
        console.error('Access token or refresh token is missing!');
        throw new UnauthorizedException('Please login to access this resource!');
      };
  
      if (accessToken) {
        const decoded = this.jwtService.decode(accessToken);

        const expirationTime = decoded?.exp;
      
        if (expirationTime < Date.now()) {
          await this.updateAccessToken(req);
        }
        await this.updateAccessToken(req);
      }

      return true;


  };

  private async updateAccessToken(req: any):Promise<void> {
    try {
      const refreshTokenData = req.headers.refreshtoken as string;
      const decoded = this.jwtService.verify(refreshTokenData, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      });

      if (!decoded) {
        throw new UnauthorizedException('Invalid refresh token!');
      }
      const user = await this.prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });
      
      if (!user) {
        throw new UnauthorizedException('User not found during token refresh');
      };
      const accessToken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '15m',
        },
      );
      const refreshToken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      );
      

      req.user = user;
      req.accessToken = accessToken;
      req.refreshToken = refreshToken;
    } catch (error) {
    // Re-throw the exception to propagate it up
    // throw error;
      console.log(error);
    }
  }
}
