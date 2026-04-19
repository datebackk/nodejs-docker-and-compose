import { Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity('wishlists')
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Length(1, 250)
  @Column({
    length: 250,
  })
  name: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish, (wish) => wish.wishlists)
  @JoinTable({
    name: 'wishlist_wishes',
    joinColumn: {
      name: 'wishlistId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'wishId',
      referencedColumnName: 'id',
    },
  })
  items: Wish[];
}
