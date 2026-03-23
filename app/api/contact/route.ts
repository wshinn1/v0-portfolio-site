import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Store message in database
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        message,
        created_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    // Send email notification if Resend API key is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: ['weshinn@gmail.com'],
          replyTo: email,
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1a1a1a; border-bottom: 2px solid #ff6b4a; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              
              <div style="margin: 20px 0;">
                <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              </div>
              
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              
              <p style="color: #666; font-size: 12px; margin-top: 30px;">
                This message was sent from your portfolio contact form.
              </p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Don't fail the request if email fails - message is already saved
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
