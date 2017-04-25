import { EntityBase } from '../EntityBase';
import { FacSpCommentFlag } from './FacSpCommentFlag';
import { StudSpCommentFlag } from './StudSpCommentFlag';
import { SpResult } from './SpResult';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class SanitizedSpComment extends EntityBase {
   // Generated code. Do not place code below this line.
   id: string;
   recipientId: number;
   courseId: number;
   workGroupId: number;
   authorName: string;
   commentText: string;
   facFlag: FacSpCommentFlag;
   mpCommentFlagRecipient: string;
   flag: StudSpCommentFlag;
   result: SpResult;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

