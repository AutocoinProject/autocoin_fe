import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs and filenames

// 가상 데이터베이스 또는 S3 스토리지 대신 사용할 임시 저장소 (데모용)
// 실제 프로덕션 환경에서는 DB (PostgreSQL, MongoDB 등)를 사용해야 합니다.
let posts: any[] = [];

interface CreatePostResponse {
  id: number;
  title: string;
  content: string;
  writer: string;
  fileUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const writer = formData.get('writer') as string;
    const file = formData.get('file') as File | null;

    // 1. 필수 필드 유효성 검사
    if (!title || !content || !writer) {
      return NextResponse.json(
        { message: '제목, 내용, 작성자는 필수 항목입니다.' },
        { status: 400 }
      );
    }

    let fileUrl: string | null = null;
    let originalFilename: string | null = null;

    // 2. 파일 처리 (선택 사항)
    if (file && file.size > 0) { // 파일이 실제로 존재하고 크기가 0보다 큰 경우
      // 2.1. 파일 크기 검사 (10MB)
      const MAX_FILE_SIZE_MB = 10;
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          { message: `파일 크기는 ${MAX_FILE_SIZE_MB}MB를 초과할 수 없습니다.` },
          { status: 400 } // 413 Payload Too Large도 고려 가능
        );
      }
      
      originalFilename = file.name;
      // 2.2. 파일명 중복 방지를 위해 UUID 사용 (시뮬레이션)
      const fileExtension = originalFilename.split('.').pop();
      const uniqueFilename = `${uuidv4()}.${fileExtension}`;
      
      // 2.3. S3 업로드 시뮬레이션 및 fileUrl 생성
      // 실제 프로덕션에서는 이 부분에 AWS SDK 등을 사용하여 S3에 업로드하는 로직이 들어갑니다.
      fileUrl = `https://your-simulated-bucket.s3.amazonaws.com/uploads/${uniqueFilename}`;
      console.log(`Simulating file upload: ${originalFilename} -> ${uniqueFilename} to ${fileUrl}`);
    } else if (file && file.size === 0) {
      // 빈 파일이 업로드된 경우 (필요시 에러 처리)
      console.warn('An empty file was uploaded.');
      // 이 경우 fileUrl은 null로 유지됩니다.
    }

    // 3. 새 게시글 객체 생성 (타입 명시)
    const newPost: CreatePostResponse = {
      id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1, // 더 안전한 ID 생성
      title,
      content,
      writer,
      fileUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 4. 가상 데이터베이스에 저장
    posts.push(newPost);
    console.log('New post created:', newPost);
    // console.log('Current posts store:', posts); // 너무 많은 로그를 피하기 위해 주석 처리

    // 5. 성공 응답 반환
    return NextResponse.json(newPost, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    let errorMessage = '서버 내부 오류가 발생했습니다.';
    // 에러 타입에 따른 분기 가능
    // if (error instanceof SomeSpecificError) { errorMessage = '특정 오류 메시지'; }
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}

// (GET 요청 핸들러 - 테스트 및 목록 확인용으로 임시 추가)
export async function GET() {
  // 페이지네이션, 정렬 등을 추가할 수 있습니다.
  return NextResponse.json(posts, { status: 200 });
}
 