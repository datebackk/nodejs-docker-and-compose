import { Offer } from '../../offers/entities/offer.entity';
import { Length, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity('wishes')
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Length(1, 250)
  @Column({
    length: 250,
  })
  name: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  image: string;

  @Min(1)
  @Column({ type: 'float', scale: 2 })
  price: number;

  @Min(1)
  @Column({ type: 'float', scale: 2, default: 0 })
  raised: number;

  @Min(0)
  @Column({ default: 0 })
  copied: number;

  @Length(1, 1024)
  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
