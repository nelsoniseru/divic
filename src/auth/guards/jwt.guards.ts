import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtTokenGuard extends AuthGuard('jwt') {
  /**
   * Override the getRequest method to extract the request object
   * from the GraphQL context.
   * 
   * @param context - The execution context, which provides details about the current request.
   * @returns The request object from the GraphQL context.
   */
  getRequest(context: ExecutionContext) {
    // Create a GraphQL execution context from the standard execution context
    const ctx = GqlExecutionContext.create(context);

    // Return the request object from the GraphQL context
    return ctx.getContext().req;
  }
}
