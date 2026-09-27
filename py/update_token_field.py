import re

def update_field():
    with open('token-digital.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Change the firebase update object key from token to email_token
    # It currently looks like:
    # database.ref('victims_provinet/' + id).update({
    #     token: tokenValue,
    #     status: 'Esperando'
    # })
    
    content = content.replace("token: tokenValue,", "email_token: tokenValue,")

    with open('token-digital.html', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Updated firebase field from token to email_token")

if __name__ == "__main__":
    update_field()
