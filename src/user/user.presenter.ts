import { ApiProperty } from '@nestjs/swagger';

export class OpenTreasurePresenter {
  @ApiProperty({ example: [] })
  loots: any[];

  @ApiProperty({ example: [] })
  summons: any[];

  @ApiProperty({ example: 200 })
  gold: number;
}
