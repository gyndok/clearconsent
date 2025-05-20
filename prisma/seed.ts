import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create multiple doctors
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        email: 'dr.doe@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'John',
        lastName: 'Doe',
      },
    }),
    prisma.doctor.create({
      data: {
        email: 'dr.smith@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Sarah',
        lastName: 'Smith',
      },
    }),
    prisma.doctor.create({
      data: {
        email: 'dr.johnson@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Michael',
        lastName: 'Johnson',
      },
    }),
  ]);

  // Create multiple patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        email: 'jane.smith@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1234567890',
      },
    }),
    prisma.patient.create({
      data: {
        email: 'robert.wilson@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Robert',
        lastName: 'Wilson',
        phone: '+1234567891',
      },
    }),
    prisma.patient.create({
      data: {
        email: 'emily.brown@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        firstName: 'Emily',
        lastName: 'Brown',
        phone: '+1234567892',
      },
    }),
  ]);

  // Create procedures for each doctor
  const procedures = await Promise.all([
    // Dr. Doe's procedures (Orthopedics)
    prisma.procedure.create({
      data: {
        title: 'Knee Arthroscopy',
        description: 'Minimally invasive surgical procedure on the knee joint',
        category: 'Orthopedics',
        estimatedDuration: 60,
        doctorId: doctors[0].id,
      },
    }),
    prisma.procedure.create({
      data: {
        title: 'Hip Replacement',
        description: 'Surgical procedure to replace a damaged hip joint',
        category: 'Orthopedics',
        estimatedDuration: 120,
        doctorId: doctors[0].id,
      },
    }),
    // Dr. Smith's procedures (Cardiology)
    prisma.procedure.create({
      data: {
        title: 'Cardiac Catheterization',
        description: 'Procedure to diagnose and treat heart conditions',
        category: 'Cardiology',
        estimatedDuration: 90,
        doctorId: doctors[1].id,
      },
    }),
    prisma.procedure.create({
      data: {
        title: 'Echocardiogram',
        description: 'Ultrasound of the heart to assess its function',
        category: 'Cardiology',
        estimatedDuration: 45,
        doctorId: doctors[1].id,
      },
    }),
    // Dr. Johnson's procedures (Gastroenterology)
    prisma.procedure.create({
      data: {
        title: 'Colonoscopy',
        description: 'Examination of the large intestine and rectum',
        category: 'Gastroenterology',
        estimatedDuration: 45,
        doctorId: doctors[2].id,
      },
    }),
    prisma.procedure.create({
      data: {
        title: 'Endoscopy',
        description: 'Examination of the upper digestive system',
        category: 'Gastroenterology',
        estimatedDuration: 30,
        doctorId: doctors[2].id,
      },
    }),
  ]);

  // Create assignments with different statuses
  const assignments = await Promise.all([
    // Completed assignment
    prisma.assignment.create({
      data: {
        patientId: patients[0].id,
        procedureId: procedures[0].id,
        doctorId: doctors[0].id,
        status: 'Completed',
        completedAt: new Date(),
      },
    }),
    // In Progress assignment
    prisma.assignment.create({
      data: {
        patientId: patients[1].id,
        procedureId: procedures[2].id,
        doctorId: doctors[1].id,
        status: 'In Progress',
      },
    }),
    // Sent assignment
    prisma.assignment.create({
      data: {
        patientId: patients[2].id,
        procedureId: procedures[4].id,
        doctorId: doctors[2].id,
        status: 'Sent',
      },
    }),
  ]);

  // Create chat messages for each assignment
  await Promise.all([
    // Messages for completed assignment
    prisma.chatMessage.create({
      data: {
        assignmentId: assignments[0].id,
        senderType: 'doctor',
        senderId: doctors[0].id,
        content: 'Hello Jane, I\'ve assigned you the Knee Arthroscopy procedure. Please review the materials and let me know if you have any questions.',
      },
    }),
    prisma.chatMessage.create({
      data: {
        assignmentId: assignments[0].id,
        senderType: 'patient',
        senderId: patients[0].id,
        content: 'Thank you, Dr. Doe. I\'ll review the materials and get back to you if I have any questions.',
      },
    }),
    prisma.chatMessage.create({
      data: {
        assignmentId: assignments[0].id,
        senderType: 'patient',
        senderId: patients[0].id,
        content: 'I\'ve reviewed all the materials and completed the consent form.',
      },
    }),
    // Messages for in-progress assignment
    prisma.chatMessage.create({
      data: {
        assignmentId: assignments[1].id,
        senderType: 'doctor',
        senderId: doctors[1].id,
        content: 'Hello Robert, I\'ve scheduled your Cardiac Catheterization for next week. Please review the procedure information.',
      },
    }),
    prisma.chatMessage.create({
      data: {
        assignmentId: assignments[1].id,
        senderType: 'patient',
        senderId: patients[1].id,
        content: 'Dr. Smith, I have a question about the recovery time after the procedure.',
      },
    }),
    // Messages for sent assignment
    prisma.chatMessage.create({
      data: {
        assignmentId: assignments[2].id,
        senderType: 'doctor',
        senderId: doctors[2].id,
        content: 'Hello Emily, I\'ve assigned you the Colonoscopy procedure. Please review the materials at your convenience.',
      },
    }),
  ]);

  console.log('Database has been seeded with comprehensive test data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 