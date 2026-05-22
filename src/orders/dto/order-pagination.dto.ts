import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "../../common";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";


export class OrderPaginationDto extends PaginationDto{

    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `Los status validos son ${OrderStatusList}`
    })

    status: OrderStatus;
}