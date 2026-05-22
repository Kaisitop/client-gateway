import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const rpcError = exception.getError() as {
      status: number;
      message: string;
    };

    if(rpcError.toString().includes('Empty response')){
      return res.status(500).json({
        status: 500,
        message: rpcError.toString().substring(0, rpcError.toString().indexOf('(') - 1)
      })
    }
    const name = exception.name
    console.log('ERROR',{ rpcError });
    console.log('ERROR NAME', name);
    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;
      return res.status(status).json(rpcError);
    }

    res.status(400).json({
      status: 400,
      message: rpcError,
    });
  }
}
