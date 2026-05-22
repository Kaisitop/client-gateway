import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";

export class StatusDto {
    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `Los status validos son ${OrderStatusList}`
    })
    status: OrderStatus
}