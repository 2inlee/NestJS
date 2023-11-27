import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map, observable, tap } from "rxjs";

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  /**
   * 요청이 들어올 때 req 요청이 들어온 타임스탬프를 찍는다.
   * [REQ] {요청 path} {요청시간}
   * 
   * 요청이 끝날때 (응답이 나갈때) 다시 타임스탬프를 찍는다.
   * [RES] {요청 path} {응답시간} {얼마나 걸렸는지 ms}
   * 
   */
  const req = context.switchToHttp().getRequest();

  // /posts
  // /common/image
  const path = req.originalUrl;

  const now = new Date();

  // [REQ] {요청 path} {요청시간}
  console.log(`[REQ] ${path} ${now.toLocaleDateString('kr')}`);

  // return next.handle()를 실행하는 순간
  // 라우트의 로직이 전부 실행되고 응답이 반환된다.
  // observabl
  return next
  .handle().
  pipe(
    tap((observable)=>console.log(observable),
    ),
    map(
      (observable)=>{
        return {
          message: '응답이 변경되었습니다.',
          response: observable,
        }
      }
    )
  )
  }
}